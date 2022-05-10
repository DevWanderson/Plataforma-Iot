import paho.mqtt.client as mqtt
import base64
import struct
import json
import pymongo
from datetime import datetime
from datetime import timezone
import pytz
from tzlocal import get_localzone
import decoder_v2
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import alerts

admin_client = False

br = pytz.timezone('Brazil/East')


myclient = pymongo.MongoClient("mongodb://ibti:ibti@localhost:27017/")
mydb = myclient["data"]
db_meta = myclient["metadata"]
mycol = mydb["logs"]
col_types = db_meta["types"]
col_errors = mydb["logs"]
col_users = db_meta["users"]
col_alerts = db_meta["alerts"]
lista_tipos = []
lista_usuarios = []
lista_alertas = []
metabasedb = myclient['users']

def start():
    cursor = col_users.find()
    print ("usuarios carregados")
    for i in cursor:
        lista_usuarios.append(i)
        #print (i)
    cursor = col_types.find()
    print ("tipos carregados")
    for i in cursor:
        lista_tipos.append(i)
        #print (i)
    cursor = col_alerts.find()
    print ("alertas carregadas")
    for i in cursor:
        lista_alertas.append(i)
        #print (i)


def on_publish (client, topic, message):
#    client.publish(topic, message)
    print ("Published")

def on_connect(client, userdata, flags, rc):
    print("MQTT conectado. Cod:  " + str(rc))
    client.subscribe("ibti/bruno/lora/#")

def on_message(client, userdata, msg):
    global lista_usuarios
    global lista_tipos
    global lista_alertas
    global myclient
    global mydb
    client2 = mqtt.Client("pub7777")
    client2.disconnect()
#    cursor = col_dev.find()

    message = ''
    message = str(msg.payload.decode("utf-8"))
    print(message)
    print("####")
    #print(type(message))

    if ("uplink" in message):
        payload = json.loads(message)
        dev = payload["meta"]["device"]
        tipo = ""
        processar = False
        user = ''
        collection_id = ''
        department = ''
        login = ''

        for i in lista_usuarios:
            #print('##### I: ', i)
            if 'devices' in i.keys():
                if dev in i["devices"]:
                    tipo = i["devices"][str(dev)]["type"]
                    processar = True
                    user = str(i['user'])
                    login = i['login']
                    collection_id = str(i['devices'][str(dev)]['id'])
                    if 'department' in i["devices"][str(dev)].keys():
                        department = i["devices"][str(dev)]['department']
                    else:
                        department = None
        if processar:
            try:
                for i in lista_tipos:
                    if tipo in i["name"]:
                        saida = decoder_v2.Decode.decode(message, i)
                        #saida["device"] = str(dev)
                        print ("Saida Decoder: ", str(dev), " do tipo ", str(tipo))
                        print (str(saida))
#                        x = mycol.insert_one(saida)
                        #saida_mongodb = json.dumps(saida)
#                        y = on_publish(client2, "/ibti/kafkaout", str(saida))
                        #z = client2.connect("localhost", 1883)
                        #print (z)
                        #client2.publish("logs", str(saida))
                        print ("...............................")
                        print (str(saida))
                        collection = mydb[collection_id]
                        #collection = mydb[str(dev)] <---- ALTERAÇÃO DE COLEÇÃO 
                        saida['ts'] = int(saida['ts'])
                        x = collection.insert_one(saida)
                        saida["dev"] = str(dev)
                        saida.pop("_id", None)
                        saida['type'] = tipo
                        saida['department'] = department
                        saida['login'] = login
                        collection = metabasedb[saida['login']] # <---- ALTERAÇÃO DE COLEÇÃO 
                        print('Metabase dict: ', saida)
                        y = collection.insert_one(saida)
                        mongo_col = mydb['metabase'] # <----- ALTERAÇÃO DE COLEÇÃO
                        y = mongo_col.insert_one(saida)
                        #client2.publish("/ibti/kafkaout", str(saida))
                        #client2.disconnect()
                        last_seen = 'devices.' + str(dev) + '.last_seen'
                        last_seen_str = 'devices.' + str(dev) + '.last_seen_str'
                        dt = datetime.fromtimestamp(saida["ts"])
                        dt = dt.astimezone(br)
                        dt_str = ''
                        if dt.day < 10:
                            dt_str += '0' + str(dt.day)
                        else:
                            dt_str += str(dt.day)
                        dt_str += '/'
                        if dt.month < 10:
                            dt_str += '0' + str(dt.month)
                        else:
                            dt_str += str(dt.month)
                        dt_str += '/' + str(dt.year)
                        dt_str += ' '
                        if dt.hour < 10:
                            dt_str += '0' + str(dt.hour)
                        else:
                            dt_str += str(dt.hour)
                        dt_str += ':'
                        if dt.minute < 10:
                            dt_str += '0' + str(dt.minute)
                        else:
                            dt_str += str(dt.minute)
                        dt_str += ':'
                        if dt.second < 10:
                            dt_str += '0' + str(dt.second)
                        else:
                            dt_str += str(dt.second)
                        col_users.update_one({'user':user}, { '$set': {last_seen: saida["ts"]}})
                        col_users.update_one({'user':user}, { '$set': {last_seen_str: dt_str}})
                        try:
                            alerts.Alerts.alerts(dev, saida, lista_usuarios, lista_alertas, col_alerts, col_users)
                        except Exception as e:
                            print (e)
                            print("## Alerta terminado com erro ##")
                            print()

                        """"
                        
                        for ii in lista_alertas:
                            if (dev in ii['device_eui']):
                                print('# ALERTA ENCONTRADO #')
                                for jj in ii['vars'].keys():
                                    #print('Variavel: ', jj)
                                    #print('Chaves: ', ii['vars'][jj].keys())
                                    query = {'device_eui':dev}
                                    dict_alert = col_alerts.find_one(query)
                                    if ('ts' in ii['vars'][jj].keys() and 'period' in ii['vars'][jj].keys()):
                                        ts_alert = int(dict_alert['vars'][jj]['ts'])
                                        print('ts: ', int(saida['ts']))
                                        print('ts: ', ts_alert)
                                        print('soma ts: ', ts_alert + int(ii['vars'][jj]['period']))
                                        if (int(saida['ts']) >= ts_alert + int(ii['vars'][jj]['period'])):
                                            #saida[jj] = saida[jj] + 101
                                            print('Variavel: ', jj)
                                            print('Valor: ', saida[jj])
                                            print('Mensagem: ', ii['vars'][jj]['msg'])
                                            print('Condição: ', ii['vars'][jj]['if'])
                                            print('Argumento: ', ii['vars'][jj]['arg_if'])
                                            print('Email: ', ii['email'])
                                            if ('gt' in ii['vars'][jj]['if']):
                                                if (saida[jj] > ii['vars'][jj]['arg_if']):
                                                    str_alert = (ii['vars'][jj]['msg'].format(arg_if = ii['vars'][jj]['arg_if'], var = saida[jj]))
                                                    print(str_alert)
                                                    try:
                                                        server = smtplib.SMTP(smtp_server,port)
                                                        server.ehlo() # Can be omitted
                                                        server.starttls(context=context) # Secure the connection
                                                        server.ehlo() # Can be omitted
                                                        server.login(sender_email, password)
                                                        message = MIMEMultipart("alternative")
                                                        try:
                                                            name_device = ""
                                                            for kk in lista_usuarios:
                                                                if dev in kk['devices'].keys() and name_device == '':
                                                                    name_device = kk['devices'][dev]['name']
                                                                    print (name_device)
                                                                    break
                                                            message['Subject'] = 'Alerta de ' + str(name_device)
                                                        except:
                                                            message['Subject'] = 'Alerta de ' + str(dev)
                                                        part1 = MIMEText(str_alert, "plain")
                                                        message.attach(part1)
                                                        server.sendmail(sender_email, ii['email'], message.as_string())
                                                        update_field = 'vars.' + jj + '.ts'
                                                        col_alerts.update_one({'device_eui':dev}, { '$set': {update_field: saida["ts"]}})
                                                        print ('Email enviado')
                                                    except Exception as e:
                                                        # Print any error messages to stdout
                                                        print(e)
                                                    finally:
                                                        server.quit() 
                                                        """
                        break
                
                        

            except Exception as e:
                print(e)
                saida_erro = {}
                time_stamp = datetime.now()
                saida_erro["erro"] = str(e)
                saida_erro["time"] = str(time_stamp.hour) + ":" + str(time_stamp.minute) + ":" + str(time_stamp.second) + " - " + str(time_stamp.day) + "/" + str(time_stamp.month) + "/" + str(time_stamp.year)
                x = col_errors.insert_one(saida_erro)

    elif ("atualizar listas" in message):
        print("##Atualizar##")
        lista_usuarios = []
        lista_tipos = []
        lista_alertas = []
        cursor = col_users.find()
        for i in cursor:
            lista_usuarios.append(i)

        cursor = col_types.find()
        for i in cursor:
            lista_tipos.append(i)
        
        cursor = col_alerts.find()
        for i in cursor:
            lista_alertas.append(i)
        
        saida_log = {}
        time_stamp = datetime.now()
        saida_log["log"] = "listas atualizadas em " + str(time_stamp.hour) + ":" + str(time_stamp.minute) + ":" + str(time_stamp.second) + " - " + str(time_stamp.day) + "/" + str(time_stamp.month) + "/" + str(time_stamp.year)
        x = col_errors.insert_one(saida_log)


start_flag = False
while (start_flag == False):
    try:
        start()
        start_flag = True
    except:
        start_flag = False


client = mqtt.Client("sub2_teste")
client.username_pw_set(username="bruno",password="bruno")
client.connect("localhost", 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()
client.disconnect()
