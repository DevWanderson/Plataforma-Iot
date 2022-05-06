import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import telegram_alert
import pymongo
import time

debug = True

class Alerts:
    def email(lista_usuarios, dev, str_alert, ii, jj, saida, col_alerts, col_users):
        try:
            name_device = ""
            telegram_id = 0
            user_name = ""
            dev_id = ""
            for kk in lista_usuarios:
                if dev in kk['devices'].keys() and name_device == '':
                    name_device = kk['devices'][dev]['name']
                    dev_id = kk['devices'][dev]['id']
                    if "telegram_id" in kk.keys():
                        telegram_id = int(kk["telegram_id"])   
                        user_name = kk["user"]
                    print (name_device)
                    
            if 'email' in ii['alerts'][jj].keys():
                print('----> Email encontrado: ' + ii['alerts'][jj]['email'])
                smtp_server = "smtp.gmail.com"
                port = 587  
                sender_email = "plataformaiotibti@gmail.com"
                password = 'Ibti@2022'
                context = ssl.create_default_context()
                server = smtplib.SMTP(smtp_server,port)
                server.ehlo() 
                server.starttls(context=context) 
                server.ehlo() 
                server.login(sender_email, password)
                message = MIMEMultipart("alternative")

                if name_device != "":
                    message['Subject'] = 'Alerta de ' + str(name_device)
                else:
                    message['Subject'] = 'Alerta de ' + str(dev)
                
                for saida_key in saida.keys():
                    str_alert += '\n\r'
                    str_alert += str(saida_key) + ': ' + str(saida[saida_key])
                part1 = MIMEText(str_alert, "plain")
                message.attach(part1)
                server.sendmail(sender_email, ii['alerts'][jj]['email'], message.as_string())
                
                print ('Email enviado')
                server.quit() 
             
            print ('Telegram ID: ', telegram_id)
            if telegram_id != '':
                str_aux = str(name_device) + '\n\r' + 'Ola, ' + str(user_name) + '\n\r' + str(str_alert)
                print(str_aux)
                telegram_alert.Telegram.send_alert(str_aux, telegram_id)
                print('Telegram enviado')
            update_field = 'alerts.' + jj + '.ts'
            col_alerts.update_one({'device_eui':dev}, { '$set': {update_field: saida["ts"]}})
            alerts_quant = 0
            user_item = col_users.find_one({'user': user_name})
            if debug:
                print("----> user_item: ")
                print(user_item)
            if 'n_alerts' in user_item.keys():
                alerts_quant = int(user_item['n_alerts'])
            col_users.update_one({'user':user_name}, { '$set': {'n_alerts': alerts_quant + 1}})
            #armazenando alerta no database alerts collection dev_id
            alert_dict = {}
            alert_dict['msg'] = str_alert
            alert_dict['ts'] = int(time.time())
            alert_dict['dev_name'] = name_device
            if telegram_id != '':
                alert_dict['mode'] = 'Telegram'
            else:
                alert_dict['mode'] = 'Email'
            myclient = pymongo.MongoClient("mongodb://ibti:ibti@localhost:27017/")
            mydb = myclient["alerts"]
            mydb[dev_id].insert_one(alert_dict)
        except Exception as e:
            # Print any error messages to stdout
            print(e)

    def alerts(dev, saida, lista_usuarios, lista_alertas, col_alerts, col_users):
        for ii in lista_alertas:
            if (dev in ii['device_eui']):
                print('# Dispositivo com alertas #')
                query = {'device_eui':dev}
                dict_alert = col_alerts.find_one(query)
                for jj in ii['alerts'].keys():
                    #print()    
                    if (debug):
                        print('## Alerta: ', jj, ' ##')
                        print('Chaves: ', ii['alerts'][jj]['vars'])
                    if (dict_alert['alerts'][jj]['status'] == True and 'ts' in ii['alerts'][jj].keys() and 'period' in ii['alerts'][jj].keys()):
                        ts_alert = int(dict_alert['alerts'][jj]['ts'])
                        if (debug):
                            print('ts: ', int(saida['ts']))
                            print('ts: ', ts_alert)
                            print('soma ts: ', ts_alert + int(ii['alerts'][jj]['period']))
                        if (int(saida['ts']) >= ts_alert + int(ii['alerts'][jj]['period'])):
                            conditions_return = []
                            for var_index in range(len(ii['alerts'][jj]['vars'])):
                                if (debug):
                                    print('Var Index: ', var_index)
                                    print('Variavel: ', ii['alerts'][jj]['vars'][var_index])
                                    print('Valor: ', saida[ii['alerts'][jj]['vars'][var_index]])
                                    print('Mensagem: ', ii['alerts'][jj]['msg'])
                                    print('Condição: ', ii['alerts'][jj]['if'][var_index])
                                    print('Argumento 1: ', ii['alerts'][jj]['arg_1'][var_index])
                                    print('Argumento 2: ', ii['alerts'][jj]['arg_2'][var_index])
                                    #print('Email: ', ii['email'])
                                try:
                                    print('----> Alerta: ' + jj)
                                    if ('gt' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('Gt detectado')
                                        if (saida[ii['alerts'][jj]['vars'][var_index]] > ii['alerts'][jj]['arg_1'][var_index]):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)  
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if ('gte' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('Gte detectado')
                                        if (saida[ii['alerts'][jj]['vars'][var_index]] >= ii['alerts'][jj]['arg_1'][var_index]):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)              
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if ('lt' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('Lt detectado')
                                        if (saida[ii['alerts'][jj]['vars'][var_index]] < ii['alerts'][jj]['arg_1'][var_index]):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if ('lte' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('Lte detectado')
                                        if (saida[ii['alerts'][jj]['vars'][var_index]] <= ii['alerts'][jj]['arg_1'][var_index]):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if ('e' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('E detectado')
                                        if (float(saida[ii['alerts'][jj]['vars'][var_index]]) == float(ii['alerts'][jj]['arg_1'][var_index])):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if ('btw' in ii['alerts'][jj]['if'][var_index]):
                                        if (debug):
                                            print('Btw detectado')
                                        if (saida[ii['alerts'][jj]['vars'][var_index]] >= ii['alerts'][jj]['arg_2'][var_index] and saida[ii['alerts'][jj]['vars'][var_index]] <= ii['alerts'][jj]['arg_1'][var_index]):
                                            if (debug):
                                                print("Condição verdadeira")
                                            conditions_return.append(True)
                                        else:
                                            if (debug):
                                                print("Condição falsa")
                                            conditions_return.append(False)
                                    if (debug):
                                        print('Lista de retorno: ', conditions_return)
                                    if (all(conditions_return) and len(conditions_return) == len(ii['alerts'][jj]['vars'])):      
                                        str_alert = (ii['alerts'][jj]['msg'].format(arg_1 = ii['alerts'][jj]['arg_1'][var_index], arg_2 = ii['alerts'][jj]['arg_2'][var_index], var = saida[ii['alerts'][jj]['vars'][var_index]]))
                                        if (debug):
                                            print(str_alert)  
                                        Alerts.email(lista_usuarios, dev, str_alert, ii, jj, saida, col_alerts, col_users)
                                except:
                                    print("Provavelmente a variável escolhida não possui valor ou é inexistente")
                    elif (dict_alert['alerts'][jj]['status'] != True):
                        print("----> Alerta desativado")
                                        