import telebot
import pymongo
import config

myclient = pymongo.MongoClient(config.mongo_uri)
bot = telebot.TeleBot(config.telegram_token, parse_mode=None) 

db_meta = myclient["metadata"]
col_users = db_meta["users"]
lista_usuarios = []

login_list = []

def carregar_listas():
	global lista_usuarios
	global col_users
	cursor = col_users.find()
	lista_usuarios = []
	for i in cursor:
		lista_usuarios.append(i)
		#print(i)
	print("Lista de usuarios atualizada")

@bot.message_handler(commands=['logon', 'login'])
def login(message):
	global login_list
	print("#### id: ", message.chat.id)
	print(login_list)
	index = next((index for (index, d) in enumerate(login_list) if d["id"] == str(message.chat.id)), None)
	if not any(d.get('id') == str(message.chat.id) for d in login_list):
		user_temp = {'id': str(message.chat.id)}
		login_list.append(user_temp)
		bot.reply_to(message, "Digite o nome de usuário")
	elif ('password' in login_list[index].keys()):
		bot.reply_to(message, "Usuário já logado!")
	else:
		bot.reply_to(message, "Continue com o login")

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    global bot
    print(type(message.chat))
    print (message.chat)
    bot.reply_to(message, "Olá, insira seu email")

@bot.message_handler(func=lambda m: True)
def echo_all(message):
	global login_list
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
	carregar_listas()
	if any(d.get('user') == login_list[index]['username'] for d in lista_usuarios):
		index_usuarios = next((index for (index, d) in enumerate(lista_usuarios) if d["user"] == login_list[index]['username']), None)
		print('Usuário ', lista_usuarios[index_usuarios]['user'], ' encontrado')
		if login_list[index]['password'] == lista_usuarios[index_usuarios]['user']:
			print('Senha correta')
			login_list[index]['login'] = True
			print(login_list)
			col_users.update_one({'user':lista_usuarios[index_usuarios]['user']}, { '$set': {'telegram_id': str(message.chat.id)}})
			bot.reply_to(message, 'Login realizado com sucesso.')
			bot.reply_to(message, 'A partir de agora você receberá alertas de seus dispositivos por este canal.')
		else:
			print('Senha incorreta')
			bot.reply_to(message, 'Nome de usuário ou senha não conferem!')
			login_list.pop(index)
			print(login_list)
	else:
		print('Usuário não encontrado')
		login_list.pop(index)
		bot.reply_to(message, 'Nome de usuário ou senha não conferem!')
			
bot.polling()
