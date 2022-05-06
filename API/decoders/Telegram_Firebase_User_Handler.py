import telebot
import pymongo
import pyrebase
import time

myclient = pymongo.MongoClient("mongodb://ibti:ibti@52.179.6.118:27017/")
bot = telebot.TeleBot("1764004221:AAEBgIYb2AcEnUxQUCbkRoDkk-5WiQ3ifMg", parse_mode=None) 
tb = telebot.AsyncTeleBot("1764004221:AAEBgIYb2AcEnUxQUCbkRoDkk-5WiQ3ifMg")

firebaseConfig = {
    'apiKey': "AIzaSyAvYUBSED7D5BoDWwPVJa7jsVP8rLQzdqo",
    'authDomain': "plataformaiot-64c64.firebaseapp.com",
    'databaseURL': "https://plataformaiot-64c64-default-rtdb.firebaseio.com",
    'projectId': "plataformaiot-64c64",
    'storageBucket': "plataformaiot-64c64.appspot.com",
    'messagingSenderId': "800863963175",
    'appId': "1:800863963175:web:e3317b573e629a43726602",
    'measurementId': "G-QJRT4QQ8QQ"
} 

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

db_meta = myclient["metadata"]
col_users = db_meta["users"]
lista_usuarios = []

login_list = []

def send_msg(user_id, msg):
        message = telebot.util.split_string(msg, 3000)
        print(message)
        for txt in message:
            tb.send_message(user_id, txt)
        time.sleep(0.5)

def start_listas():
    global lista_usuarios
    global col_users
    global login_list
    cursor = col_users.find()
    lista_usuarios = []
    for i in cursor:
        lista_usuarios.append(i)
        #print(i)
        if 'telegram_id' in i.keys():
            index = next((index for (index, d) in enumerate(login_list) if d["id"] == i['telegram_id']), None)
            if index == None:
                user_temp = {'id': i['telegram_id'], 'password': None} 
                login_list.append(user_temp)
    print("Lista de usuarios carregada")
    print(login_list)

def carregar_listas():
    global lista_usuarios
    global col_users
    cursor = col_users.find() 
    lista_usuarios = []
    for i in cursor:
        lista_usuarios.append(i)
        #print(i)

    print("Lista de usuarios atualizada")

@bot.message_handler(commands=['logout', 'exit'])
def logout(message): 
    global lista_usuarios
    global col_users
    global login_list
    carregar_listas()
    id = str(message.chat.id)
    index_usuarios = -1
    try:
        for i in range(len(lista_usuarios)):
            if 'telegram_id' in lista_usuarios[i].keys():
                if lista_usuarios[i]["telegram_id"] == str(message.chat.id):
                    index_usuarios = i
                    if index_usuarios >= 0:
                        print('Apagando chave para usuário ', lista_usuarios[index_usuarios]['user'], ' e id ', id)
                        col_users.update_one({'user':lista_usuarios[index_usuarios]['user']}, { '$unset': {'telegram_id': id}})
                        index = next((index for (index, d) in enumerate(login_list) if d["id"] == id), None)
                        login_list.pop(index)
                        bot.reply_to(message, "Logout realizado!")
                        carregar_listas()
    except:
        pass
    

@bot.message_handler(commands=['logon', 'login', 'start'])
def login(message):
    global login_list
    print("#### id: ", message.chat.id)
    bot.reply_to(message, "Olá")
    index = next((index for (index, d) in enumerate(login_list) if d["id"] == str(message.chat.id)), None)
    if not any(d.get('id') == str(message.chat.id) for d in login_list):
        user_temp = {'id': str(message.chat.id)}
        login_list.append(user_temp)
        bot.reply_to(message, "Digite o email")
    elif ('password' in login_list[index].keys()):
        bot.reply_to(message, "Usuário já logado!")
    else:
        bot.reply_to(message, "Continue com o login")
    print(login_list)


@bot.message_handler(commands=['help'])
def send_welcome(message):
    global bot
    print(type(message.chat))
    print (message.chat)
    bot.reply_to(message, "Olá, eu sou o bot da Plataforma IoT do IBTI.")
    bot.reply_to(message, "Se você ainda não realizou o login, entre com o comando /login e aproveite este canal para receber as alertas de seus dispositivos")
    bot.reply_to(message, "Se deseja parar de receber alertas nessa conta do Telegram, insira o comando /logout")

@bot.message_handler(func=lambda m: True)
def echo_all(message):
    print('## Message handler')
    global login_list
    print(login_list)
    id = str(message.chat.id)
    if len(login_list) > 0:
        if any(d.get('id') == id for d in login_list):
            index = next((index for (index, d) in enumerate(login_list) if d["id"] == id), None)
            if not('username' in login_list[index].keys()):
                login_list[index]['username'] = message.text
                bot.reply_to(message, 'Digite a senha')
            elif not('password' in login_list[index].keys()):
                login_list[index]['password'] = message.text
                login_check_user_password(index, message)


def login_check_user_password(index, message):
    global login_list
    global lista_usuarios
    global auth
    carregar_listas()
    user_auth = {}
    try:
        user_auth = auth.sign_in_with_email_and_password(login_list[index]['username'], login_list[index]['password'])
        print(user_auth)
        if any(d.get('login') == user_auth['localId'] for d in lista_usuarios):
            print('#')
            index_usuarios = 0
            for i in range(len(lista_usuarios)):
                if 'login' in lista_usuarios[i].keys():
                    if lista_usuarios[i]["login"] == user_auth['localId']:
                        index_usuarios = i
            print('Usuário ', lista_usuarios[index_usuarios]['user'], ' encontrado')
            col_users.update_one({'user':lista_usuarios[index_usuarios]['user']}, { '$set': {'telegram_id': str(message.chat.id)}})
            bot.delete_message(message.chat.id, message.message_id, timeout=None)
            send_msg(login_list[index]['id'], 'Login realizado com sucesso.')
            send_msg(login_list[index]['id'], 'A partir de agora você receberá alertas de seus dispositivos por este canal.')
            carregar_listas()
        else:
            print('Try: Usuário não encontrado')
            login_list.pop(index) 
            bot.delete_message(message.chat.id, message.message_id, timeout=None)
            send_msg(login_list[index]['id'], 'Email e/ou senha não conferem!')
            id = str(message.chat.id)
            user_temp = {'id': str(message.chat.id)}
            login_list.append(user_temp)
            send_msg(id, "Digite o email")
    except:
        bot.delete_message(message.chat.id, message.message_id, timeout=None)
        print('Except: Usuário não encontrado')
        send_msg(login_list[index]['id'], 'Email e/ou senha não conferem!')
        login_list.pop(index)
        id = str(message.chat.id)
        user_temp = {'id': str(message.chat.id)}
        login_list.append(user_temp)
        send_msg(id, "Digite o email")

start_listas()    
try:
    bot.infinity_polling(timeout=10, long_polling_timeout = 5)
except Exception as e:
    print(e)
    pass