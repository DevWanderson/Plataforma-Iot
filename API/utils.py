import datetime, time
import paho.mqtt.client as mqtt
from typing import Optional
import argparse

class timestamp_operations():
  def date_to_timestamp(date):
    return int(time.mktime(datetime.datetime.strptime(date, '%d/%m/%Y').timetuple()))

  def full_date_to_timestamp(date):
    return int(time.mktime(datetime.datetime.strptime(date, '%d/%m/%Y %H:%M:%S').timetuple()))

def handle_args():
  parser = argparse.ArgumentParser()
  parser.add_argument("--host", default="0.0.0.0", help="host broadcasting address.")
  parser.add_argument("--port", default="8000", help="server port number.")
  parser.add_argument("--reload", action="store_true", help="allow application reload.")
  parser.add_argument("--ssl", action="store_false", help="SSL certificates.")
  
  return vars(parser.parse_args())

def sort_devices(devices: list, method: Optional [str] = None):
  if method == 'latest':
    devices = sorted(devices, key = lambda d: d ['act_date'], reverse = True)
    

  elif method == 'alphanumeric':
    devices = sorted(devices) 

  else:
    return devices

  return devices

def db_update():
  client = mqtt.Client('ibti-api')
  client.username_pw_set('bruno', 'bruno')
  client.connect('52.179.6.118', 1883, 60)
  client.publish('ibti/bruno/lora/atualizar', 'atualizar listas')
  client.disconnect()

def alert_operator(opr):
  if opr == '>':
    return 'gt'
  elif opr == '>=':
    return 'gte'
  elif opr == '<':
    return 'lt'
  elif opr == '<=':
    return 'lte'
  elif opr == '=':
    return 'eq'
  elif opr == '<>':
    return 'btw'
  else:
    return None