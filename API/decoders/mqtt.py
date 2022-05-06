import paho.mqtt.client as mqtt
import base64
import struct
import json
import pymongo
from datetime import datetime
from datetime import timezone
import alerts
import pytz
from tzlocal import get_localzone
import nacl.secret
import nacl.utils

br = pytz.timezone('Brazil/East')

myclient = pymongo.MongoClient("mongodb://ibti:ibti@localhost:27017/")
mydb = myclient["data"]
db_meta = myclient["metadata"]
mycol = mydb["logs"]
col_dev = db_meta["devices"]
col_types = db_meta["types"]
col_errors = mydb["logs"]
col_users = db_meta["users"]
col_alerts = db_meta["alerts"]
metabasedb = myclient['users']
lista_dispositivos = []
lista_tipos = []
lista_usuarios = []
lista_alertas = []

def start():
    cursor = col_users.find()
    print ("dispositivos:")
    for i in cursor:
        lista_usuarios.append(i)
        print (i)
    
    cursor = col_alerts.find()
    print ("alertas carregadas")
    for i in cursor:
        lista_alertas.append(i)
        #print (i)

def on_connect(client, userdata, flags, rc):
    print("MQTT conectado. Cod:  " + str(rc))
    client.subscribe("ibti/#")

def on_message(client, userdata, msg):
    global lista_usuarios
    global lista_alertas
    global myclient
    global mydb
    global metabasedb

    message = ''
    topico = ''
    #print(msg.payload)
    try:
        message = str(msg.payload.decode("utf-8"))
        topico = msg.topic.split('/')
    except:
        pass

    #print('----> Message received:' + message)

    if ("atualizar listas" in message):
        print("##Atualizar##")
        cursor = col_users.find()
        lista_usuarios = []
        lista_alertas = []
        for i in cursor:
            lista_usuarios.append(i)
            print (i)

        cursor = col_alerts.find()
        for i in cursor:
            lista_alertas.append(i)

    elif len(topico) > 1:
        
        for i in lista_usuarios:
            if (i['MQTTuser'] in topico[1]):
                for j in i['devices']:
                    if (j in topico[2]):
                        saida = {}
                        #saida["device"] = str(j)
                        payload = {}
                        try:
                            #print('----> User: ' + topico[1])
                            #print('----> Dev: ' + topico[2])
                            payload = json.loads(message)
                            print('Payload: ', payload)
                        except:
                            print('Erro no payload')
                            break
                        entrada = {}
                        if ('_type' in payload.keys()):
                            #print ("Payload Criptografado")
                            if 'encrypted' in payload['_type']:
                                key = i['key']
                                k = nacl.secret.SecretBox(key.encode())
                                entrada = json.loads(k.decrypt(base64.b64decode(payload['data'])))
                            else:
                                print("Else ", payload)
                                entrada = payload
                                entrada.pop("_type", None)
                            try:
                                print('entrada: ', entrada)

                                saida["ts"] = entrada["tst"]
                                saida["lat"] = entrada["lat"]
                                saida["long"] = entrada["lon"]
                                saida["altitude"] = entrada["alt"]
                                saida["velocidade"] = entrada["vel"]
                                
                                mongo_col = mydb[i['devices'][str(j)]['id']]
                                x = mongo_col.insert_one(saida)
                                #client2 = mqtt.Client("pubmqtt")
                                #client2.username_pw_set(username="superuser",password="bEOmT34OpW")
                                #client2.connect("localhost", 1883)
                                #topic_pub = 'ibtioutput/' + i['MQTTuser'] + '/' + j
                                #client2.publish(topic_pub, str(saida))

                                saida["dev"] = str(j)
                                saida.pop("_id", None)
                                saida['type'] = i['devices'][str(j)]['type']
                                if 'department' in i['devices'][str(j)].keys():
                                    saida['department'] = i['devices'][str(j)]['department']
                                else:
                                    saida['department'] = 'Todos'
                                saida['login'] = i['login']
                                collection = metabasedb[saida['login']] # <---- ALTERAÇÃO DE COLEÇÃO 
                                print('Metabase dict: ', saida)
                                y = collection.insert_one(saida)

                                saida["dev"] = str(j)
                                saida['type'] = i['devices'][str(j)]['type']
                                if 'department' in i['devices'][str(j)].keys():
                                    saida['department'] = i['devices'][str(j)]['department']
                                else:
                                    saida['department'] = None
                                saida.pop("_id", None)
                                #client2.disconnect()
                                saida['login'] = i['login']
                                mongo_col = mydb['metabase'] # <----- ALTERAÇÃO DE COLEÇÃO
                                y = mongo_col.insert_one(saida)
                                last_seen = 'devices.' + str(j) + '.last_seen'
                                last_seen_str = 'devices.' + str(j) + '.last_seen_str'
                                dt = datetime.fromtimestamp(entrada["tst"])
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
                                col_users.update_one({'user':i['user']}, { '$set': {last_seen: entrada["tst"]}})
                                col_users.update_one({'user':i['user']}, { '$set': {last_seen_str: dt_str}})
                                try:
                                    alerts.Alerts.alerts(j, saida, lista_usuarios, lista_alertas, col_alerts, col_users)
                                except Exception as e:
                                    print (e)
                                    print("## Alerta terminado com erro ##")
                                    print()
                            except Exception as e:
                                print ("####ERROR#### ", e)
                        else:
                            print("User: ", i['user'], ", Dev: ", j)
                            keys = payload.keys()
                            print("Keys: ", keys)
                            for k in keys:
                                saida[k] = payload[k]
                            try:
                                mongo_col = mydb[i['devices'][str(j)]['id']]
                                #mongo_col = mydb[str(j)]
                                dt = datetime.fromtimestamp(int(datetime.timestamp(datetime.now())))
                                dt = dt.astimezone(br)
                                dt_ts = int(datetime.timestamp(datetime.now()))
                                saida['ts'] = dt_ts
                                x = mongo_col.insert_one(saida)
                                print ("MONGO: ", str(saida))
                                client2 = mqtt.Client("pubmqtt")
                                client2.username_pw_set(username="superuser",password="bEOmT34OpW")
                                client2.connect("localhost", 1883)
                                topic_pub = 'ibtioutput/' + i['MQTTuser'] + '/' + j
                                client2.publish(topic_pub, str(saida))
                                saida["device"] = str(j)
                                saida.pop("_id", None)
                                client2.disconnect()
                                last_seen = 'devices.' + str(j) + '.last_seen'
                                last_seen_str = 'devices.' + str(j) + '.last_seen_str'
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
                                col_users.update_one({'user':i['user']}, { '$set': {last_seen: dt_ts}})
                                col_users.update_one({'user':i['user']}, { '$set': {last_seen_str: dt_str}})
                                try:
                                    alerts.Alerts.alerts(j, saida, lista_usuarios, lista_alertas, col_alerts, col_users)
                                except Exception as e:
                                    print (e)
                                    print("## Alerta terminado com erro ##")
                                    print()
                            except:
                                pass
                        break

start_flag = False
while (start_flag == False):
    try:
        start()
        start_flag = True
#        start.client2.publish("logs", "iniciado")
    except:
        start_flag = False


client = mqtt.Client("submqtt")
client.username_pw_set(username="superuser",password="bEOmT34OpW")
client.connect("localhost", 1883, 60)
client.on_connect = on_connect
client.on_message = on_message

client.loop_forever()
client.disconnect()
