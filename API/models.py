import time
from pydantic import BaseModel
from typing import Optional
from utils import alert_operator
from random import randint
import random
import string
import pymongo
from credentials import mongodb_address

def build_everynet_payload (body):  
  return {
    'dev_eui': body['dev_eui'],
    'app_eui': body['app_eui'],
    'tags':['Bruno'],
    'activation': body['activation'],
    'encryption': 'NS',
    'dev_addr': body['dev_addr'],
    'nwkskey': body['nwkskey'],
    'appskey': body['appskey'],
    'app_key': body['app_key'],
    'dev_class': 'A',
    'counters_size': 4,
    'adr': {
      'tx_power': None,
      'datarate': None,
      'mode': 'on'
    },
    'band': 'LA915-928A'
  }

def build_device (body, type):
  mongo_client = pymongo.MongoClient(mongodb_address)
  md_database = mongo_client['metadata']
  col_users = md_database['users']

  while True:
    random_id = generate_MQTT_psw(10)
    querry = 'devices.' + body ['dev_eui'] + '.id'
    result = col_users.find({querry : {"$eq" : random_id}}) 
    j = 0
    for i in result:
        j += 1
    if j == 0:
      break

  return {
    'name': body['name'],
    'type': type,
    'status': 1,
    'act_date': time.time (),
    'id' : random_id
  }

def build_everynet_type (body):
  var_data = body['variables']['cards']
  var_count = len (var_data)
  variables = {}

  operations = {}
  for i in range (var_count):
    operations[var_data[i]['variavel']] =[o['operacao'] for o in var_data[i]['operationsSelects']]

  op_args = {}
  for i in range (var_count):
    op_args[var_data[i]['variavel']] =[int (a['args']) for a in var_data[i]['operationsSelects']]

  for var in var_data:
    variables[var['variavel']] = {
      'bytes':[int (var['bitInicial']), int (var['bitFinal'])],
      'signed': var['signed'],
      'operations': operations[var['variavel']],
      'op_args': op_args[var['variavel']]
    }

  return {
    'name': body['name'],
    'variables': variables,
    'size': int (body['tamanhoByte']),
    'order': body['ordemByte'],
    'global': body['global']
  }

def build_alert_body (body, dev_eui):
  if 'email' in body.keys():
    return {
      'device_eui': dev_eui,
      'alerts': {}
    }
  else:
    return {
      'device_eui': dev_eui,
      'alerts': {}
    }

def build_alert_logic (body):
  alert = {}
  alert['status'] = True
  alert['vars'] =[]
  alert['if'] =[]
  alert['arg_1'] =[]
  alert['arg_2'] =[]
  for i in body['logic']:
    alert['vars'].append (i['variable'])
    alert['if'].append (alert_operator (i['operation']))
    alert['arg_1'].append(float(i['value'] if i['operation'] != '<>' else i['minValue']))
    alert['arg_2'].append(float(0 if i['operation'] != '<>' else i['maxValue']))
  alert['msg'] = body['msg']
  alert['period'] = 5
  alert['ts'] = 0
  if body['email'] != '':
    alert['email'] = body['email']

  return alert

def build_user (body):
  return {
    'user': body['user'].split(' ')[0],
    'login': body['key'],
    'key': generate_MQTT_psw(32),
    'devices': {},
    'types':[],
    'departments':['Todos'],
    'MQTTuser': body['user'].split(' ')[0] + str(randint(1111,9999)),
    'MQTTpsw': generate_MQTT_psw(8)
  }

def generate_MQTT_psw(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


class DeviceUpdate (BaseModel):
  name: Optional[str] = None

class AlertUpdate (BaseModel):
  name: Optional[str] = None