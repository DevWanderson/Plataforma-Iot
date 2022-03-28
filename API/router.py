import json, requests
from credentials import everynet_login
from fastapi import APIRouter, Request, Response
from typing import Optional
from db import DatabaseConnector
from models import *
from utils import timestamp_operations, sort_devices, db_update
from subprocess import check_output
import os
import ast
import time
import decoder_sigfox_v2
import jwt
import config

router = APIRouter()

def set_databases():
  global db_data
  global db_metadata
  db_data, db_metadata = DatabaseConnector().get_databases('data', 'metadata')

@router.get('/')  
async def root():
  return Response(status_code = 418)

@router.get('/devices')
async def get_devices(user: Optional[str] = None, login: Optional[str] = None, dev_eui: Optional[str] = None, dev_type: Optional[str] = None, department: Optional[str] = None, status: Optional[int] = None, sort: Optional[str] = None):
  user_data = ''
  if login is None:
    user_data = db_metadata['users'].find_one({'user': user}, {'_id': False, 'devices': True})
    if user_data is None:
      return Response('User not found.', 404)
  else:
    user_data = db_metadata['users'].find_one({'login': login}, {'_id': False, 'devices': True})
    if user_data is None:
      return Response('User not found.', 404)
      
  if department and department == 'Todos':
    department = None

  if dev_eui:
    #('----> dev_eui: ', dev_eui)
    try:
      return user_data['devices'][dev_eui]
    except:
      return Response('Device not found.', 404)

  elif dev_type:
    #print('----> dev_type: ', dev_type)
    list_of_devices = []
    for dev_eui, dev_data in user_data['devices'].items():
      if status is not None:
        if dev_data['type'] == dev_type and dev_data['status'] == status:
          dev_data['device'] = dev_eui
          list_of_devices.append(dev_data)

      else:
        if dev_data['type'] == dev_type:
          dev_data['device'] = dev_eui
          list_of_devices.append(dev_data)

    if sort:
      return sort_devices(list_of_devices, 'latest')

  elif department:
    data_dev = []
    #print('----> Department: ', department)
    for i in user_data['devices'].items():
      #print('       ----> i: ', i)
      if 'department' in i[1].keys():
        #print('       ----> department: ', i[1]['department'])
        #('----')
        if department == i[1]['department']:
          i[1]['device'] = i[0]
          data_dev.append(i[1])
    return data_dev
    
  else:
    #('----> else: ', 'else')
    list_of_devices = []
    
    if status is not None:
      for dev_eui, dev_data in user_data['devices'].items():
        if dev_data['status'] == status:
          dev_data['device'] = dev_eui
          list_of_devices.append(dev_data)

    else:
      for dev_eui, dev_data in user_data['devices'].items():
        dev_data['device'] = dev_eui
        list_of_devices.append(dev_data)

    return sort_devices(list_of_devices, 'latest')

@router.get('/departments') # Retornar os setores do usuário
async def get_departments(login: str):
  user_data = ''
  departments_array = []
  departments_array.append('Todos')
  if login is not None:
    user_data = db_metadata['users'].find_one({'login': login})
    if user_data is None:
      return Response('User not found.', 404)
    elif 'departments' in user_data.keys():
      departments_array = user_data['departments']  
      return departments_array
    else:
      return departments_array
  else:
    return Response('Login key missing.', 404)

@router.get('/departments_devs') # Retornar dict com todos os setores e seus respectivos dispositivos
async def get_departments(login: str):
  user_data = ''
  departments_array = []
  departments_array.append('Todos')
  if login is not None:
    user_data = db_metadata['users'].find_one({'login': login})
    if user_data is None:
      return Response('User not found.', 404)
    else:
      departments_array = user_data['departments']
      departments_dict = {}
      for i in departments_array:
        devs_array = []
        for dev_eui, dev_data in user_data['devices'].items():
          if 'department' in dev_data.keys():
            if i in dev_data['department']:
              devs_array.append(dev_eui)
        departments_dict[i] = devs_array
      return departments_dict
  else:
    return Response('Login key missing.', 404)

@router.post('/departments') # Cadastrar um dispositivo em um setor existente
async def assing_department(login: str, request: Request):
  try:
    body = await request.json()
    print(body)
    if 'name' not in body.keys() or 'dev_eui' not in body.keys():
      return Response('Bad JSON format: No key named \'name\' or \'dev_eui\'')
    else:
      collection_users = db_metadata['users']
      user_data = collection_users.find_one({'login': login}, {'_id': False})
      if user_data is None:
        return Response('User not found.', 404)
      elif body['dev_eui'] in user_data['devices'].keys():
        querry_str = 'devices.' + body['dev_eui'] + '.department'
        db_metadata['users'].update_one({'login': login}, {'$set': {querry_str: body['name']}})
        db_update()
        return Response('Ok', 200)
      else:
        return Response('Device not found', 404)
  
  except Exception as e:
    print("----> Erro: ", e)
    return Response('Failed to parse request body.', 204)

@router.post('/new_department') # Cadastrar novo setor
async def new_department(login: str, request: Request):
  print(request)
  try:
    body = await request.json()
    print(body)
    if 'name' not in body.keys():
      return Response('Bad JSON format: No key named \'name\'')
    else:
      user_data = db_metadata['users'].find_one({'login': login}, {'_id': False})
      if user_data is None:
        return Response('User not found.', 404)
      elif 'departments' not in user_data.keys():
        departments_array = []
        departments_array.append('Todos')
        db_metadata['users'].update_one({'login': login}, {'$set': {'departments': departments_array}})
        db_update()
        user_data = db_metadata['users'].find_one({'login': login}, {'_id': False})
      if 'departments' in user_data.keys():
        if body['name'] not in user_data['departments']:
          departments_array = []
          if 'Todos' not in user_data['departments']:
            departments_array.append('Todos')
          """
          for dev_eui, dev_data in user_data['devices'].items():
            if 'department' in dev_data.keys():
              department = dev_data['department']
              if department not in departments_array:
                departments_array.append(department)
                print('----> Departments Array: ', departments_array)
          departments_array.append(body['name'])
          """
          for i in user_data['departments']:
            departments_array.append(i)
          departments_array.append(body['name'])
          db_metadata['users'].update_one({'login': login}, {'$set': {'departments': departments_array}})
          db_update()
          return departments_array
        else:
          return Response('Department already exists.', 404)
  
  except Exception as e:
    print("----> Erro: ", e)
    return Response('Failed to parse request body.', 204)  

@router.delete('/departments') # Deletar setor
async def delete_departments(user: Optional[str] = None, login: Optional[str] = None, name: Optional[str] = None):
  user_data = ''
  departments_array = []
  if login is None:
    user_data = db_metadata['users'].find_one({'user': user}, {'_id': False, 'devices': True})
    if user_data is None:
      return Response('User not found.', 404)
  else:
    user_data = db_metadata['users'].find_one({'login': login})
    if user_data is None:
      return Response('User not found.', 404)

  departments_array = user_data['departments']  

  for dev_eui, dev_data in user_data['devices'].items():
    if 'department' in dev_data.keys():
        department = dev_data['department']
        if department == name:
          querry_str = 'devices.' + dev_eui + '.department'
          db_metadata['users'].update_one({'login': login}, {'$unset': {querry_str: name}})
  if name in departments_array:
    index_array = departments_array.index(name)
    departments_array.pop(index_array)
    db_metadata['users'].update_one({'login': login}, {'$set': {'departments': departments_array}})
    return departments_array
  else:
    return Response('Department not found.', 404)

@router.post('/devices') # Cadastrar dispositivo
async def new_device(login: str, dev_type: str, request: Request, department: Optional[str] = None):
  try:
    collection = db_metadata['users']
    user_data = collection.find_one({'login': login}, {'_id': False})
  except:
    return Response('User not found.', 404)

  if dev_type == 'everynet':
    try:
      body = await request.json()
      print('----> JSON Input: ', body)
      if department:
        body['department'] = department
      everynet_payload = build_everynet_payload(body)
      print('----> everynet_payload: ', everynet_payload)
      database_payload = build_device(body, body['type'])
      print('----> database_payload: ', database_payload)
    except:
      return Response('Failed to parse request body.', 204)

    try:
      login2 = requests.post('https://ns.atc.everynet.io/api/v1.0/auth',
        data = everynet_login,
        headers = {'accept': 'application/json', 'Content-Type': 'application/json'})
    except requests.exceptions.HTTPError as http_err:
      return {'LOGIN ERROR': f'{http_err}'}

    try:
      token = login2.json()['access_token']

      r = requests.post('https://ns.atc.everynet.io/api/v1.0/devices',
        params = {'access_token': f'{token}'},
        headers = {'accept': 'application/json', 'Content-Type': 'application/json'},
        data = json.dumps(everynet_payload))

      print('----> Everynet response: ', r.text)

    except requests.exceptions.HTTPError as http_err:
      return {'HTTP ERROR': f'{http_err}'}
    except TypeError as type_err:
      return {'TYPE ERROR': f'{type_err}'}
    except Exception as err:
      return {'ERROR': f'{err}'}

    try:
      if body['dev_eui'] not in user_data['devices'].keys():
        querry_string = 'devices.' + body['dev_eui']
        if department:
          print(department)
          database_payload['department'] = department
        else:
          database_payload['department'] = 'Todos'
        collection.update_one({'login': login}, {'$set': {querry_string: database_payload}})
        db_update()
        return Response('New device registered successfully.', 201)
      else:
        return Response('Device already registered.', 400)
    except:
      return Response('Failed to insert new device onto database.', 500)

  elif dev_type == 'mqtt':
    try:
      body = await request.json()
      if 'type' in body:
        payload = build_device(body, body[type])
      else:
        payload = build_device(body, 'mqtt_custom')
    except:
      return Response('Failed to parse request body.', 204)

    try:
      if body['dev_eui'] not in user_data['devices'].keys():
        if department:
          print(department)
          payload['department'] = department
        else:
          payload['department'] = 'Todos'
        querry_string = 'devices.' + body['dev_eui']
        collection.update_one({'login': login}, {'$set': {querry_string: payload}})
        db_update()
        return Response('New device registered successfully.', 201)
      else:
        return Response('Device already registered.', 400)
    except:
      return Response('Failed to insert new device in database.', 500)

  elif dev_type == 'http':
    try:
      body = await request.json()
      if 'type' in body:
        payload = build_device(body, body[type])
      else:
        payload = build_device(body, 'http_custom')
    except:
      return Response('Failed to parse request body.', 204)

    try:
      if body['dev_eui'] not in user_data['devices'].keys():
        if department:
          print(department)
          payload['department'] = department
        else:
          payload['department'] = 'Todos'
        querry_string = 'devices.' + body['dev_eui']
        collection.update_one({'login': login}, {'$set': {querry_string: payload}})
        db_update()
        return Response('New device registered successfully.', 201)
      else:
        return Response('Device already registered.', 400)
    except:
      return Response('Failed to insert new device in database.', 500)

  else:
    return Response('Invalid device type.', 400)

@router.put('/devices') # Atualizar dispositivo
async def update_device(login: str, dev_eui: str, body: DeviceUpdate):
  collection = db_metadata['users']
  user_data = collection.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)

  if dev_eui not in user_data['devices'].keys():
    return Response('Device not found.', 404)

  if all(value == None for value in body.dict().values()):
    return Response('At least one key should be not null.', 206)

  try:
    for key, value in body.dict().items():
      if value is not None:
        querry_string = 'devices.' + dev_eui + '.' + key
        collection.update_one({'login': login}, {'$set': {querry_string: value}})
    db_update()
    return Response('Device updated successfully.', 200)
  except Exception as err:
    return Response('Failed to update device.', 304)

@router.delete('/devices') # Deletar dispositivo
async def delete_device(login: str, dev_eui: str):
  collection = db_metadata['users']
  user_data = collection.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)

  if dev_eui in user_data['devices'].keys():
    querry_string = 'devices.' + dev_eui
    collection.update_one({'login': login}, {'$unset': {querry_string: dev_eui}})
    db_update()
    return Response('Device deleted successfully.', 200)
  else:
    return Response('Device not found.', 404)

@router.get('/types') # Retornar tipo
async def get_types(login: Optional[str] = None, type_name: Optional[str] = None, is_global: Optional[str] = None):
  collection = db_metadata['types']
  
  if login:
    user_data = db_metadata['users'].find_one({'login': login}, {'_id': False})
    if user_data is None:
      return Response('User not found.', 404)

    elif type_name:
      response = collection.find_one({'name': type_name}, {'_id': False})

      if response is None:
        return response
      else:
        for device in user_data['devices'].values():
          if device['type'] == response['name']:
            return response

        return Response('Device type not found.', 404)

    else:
      list_of_types = user_data['types']
      add = False
      print('Return list of types from login token user')
      return list_of_types

  else:
    if type_name:
      return collection.find_one({'name': type_name}, {'_id': False})
    elif is_global and is_global.lower() == 'true':
      return list(collection.distinct('name', {'global': True}))
    else:
      return list(collection.distinct('name'))

@router.post('/types') # Cadastrar tipo
async def new_type(login: str, request: Request):
  try:
    body = await request.json()
    body = build_everynet_type(body)
  except:
    return Response('Failed to parse request body.', 204)

  try:
    collection = db_metadata['types']
    redundant_type = collection.find_one({'name': body['name']}, {'name': True, '_id': False})

    if not redundant_type:
      collection.insert_one(body)
      db_metadata['users'].update_one({'login': login}, {'$addToSet': {'types': body['name']}})
      db_update()
      return Response('New device type registered successfully.', 201)
    else:
      return Response('Device type already registered.', 400)

  except:
    return Response('Failed to insert new type onto database.', 500)

@router.get('/data')
async def get_data(
  user: Optional[str] = None,
  login: Optional[str] = None,
  dev_eui: Optional[str] = None,
  dev_type: Optional[str] = None,
  date: Optional[int] = None,
  from_date: Optional[int] = None,
  to_date: Optional[int] = None,
  limit: Optional[int] = None):


  if login is None: 
    user_data = db_metadata['users'].find_one({'user': user}, {'_id': False})
    if user_data is None:
      return Response('User not found.', 404)
  else:
    user_data = db_metadata['users'].find_one({'login': login}, {'_id': False})
    if user_data is None:
      return Response('User not found.', 404)

  query = {}
  list_of_devices =[]
  list_of_dev_ids =[]

  if dev_eui:
    collection = None
    if dev_eui in user_data['devices'].keys():
      collection = db_data[user_data['devices'][dev_eui]['id']]
    else:
      return Response('Device not found.', 404)

    if date:
      print('----> date: ', date)
      #date = timestamp_operations.date_to_timestamp(date)
      date = int(date)
      print('----> date ts: ', date)
      date_max = date + 3600 * 24
      print('----> date max: ', date_max)
      response = list(collection.find({'ts': {'$gte': date, '$lt': date_max}}, {'_id': False}).sort('ts', -1))

    elif from_date:
      #from_date = timestamp_operations.full_date_to_timestamp(from_date)
      from_date = int(from_date)
      if to_date:
        #to_date = timestamp_operations.full_date_to_timestamp(to_date)
        to_date = int(to_date)
        to_date += 3600*3
        if to_date > from_date:
          response = list(collection.find({'ts': {'$gte': from_date, '$lte': to_date}}, {'_id': False}).sort('ts', -1))
        else:
          return Response('Parameter "to_date" must be greater than "from_date", not less or equal.', 400)
      else:
        response = list(collection.find({'ts': {'$gte': from_date}}, {'_id': False}).sort('ts', -1))
        
    elif limit:
      response = list(collection.find(projection = {'_id': False}, limit = limit).sort('ts', -1))

    else:
      response = list(collection.find(projection = {'_id': False}).sort('ts', -1))
      #response = 'sim'

  elif dev_type: 
    response =[]

    for device, data in user_data['devices'].items():
      if data['type'] == dev_type:
        list_of_devices.append(device)

    if date:
      date = timestamp_operations.date_to_timestamp(date)
      date_max = date + 3600 * 24

      for device in list_of_devices:
        query[device] = db_data[device].find({'ts': {'$gte': date, '$lt': date_max}}, {'_id': False}).sort('ts', -1)
      
    elif from_date:
      from_date = timestamp_operations.full_date_to_timestamp(from_date)
      if to_date:
        to_date = timestamp_operations.full_date_to_timestamp(to_date)
        if to_date > from_date:
          for device in list_of_devices:
            query[device] = db_data[device].find({'ts': {'$gte': from_date, '$lte': to_date}}, {'_id': False}).sort('ts', -1)

        else:
          return Response('Parameter "to_date" must be greater than "from_date", not less or equal.', 400)

      else:
        for device in list_of_devices:
          query[device] = db_data[device].find({'ts': {'$gte': from_date}}, {'_id': False}).sort('ts', -1)

    elif limit:
      for device in list_of_devices:
        query[device] = db_data[device].find(projection = {'_id': False}, limit = limit).sort('ts', -1)

    else:
      for device in list_of_devices:
        query[device] = db_data[device].find(projection = {'_id': False}).sort('ts', -1)

  else:
    response =[]
    list_of_devices = []

    for device in user_data['devices'].keys():
      list_of_devices.append(device)

    if date:
      date = timestamp_operations.date_to_timestamp(date)
      date_max = date + 3600 * 24

      for device in list_of_devices:
        query[device] = db_data[device].find({'ts': {'$gte': date, '$lt': date_max}}, {'_id': False}).sort('ts', -1)

    elif from_date:
      from_date = timestamp_operations.full_date_to_timestamp(from_date)
      if to_date:
        to_date = timestamp_operations.full_date_to_timestamp(to_date)
        if to_date > from_date:
          for device in list_of_devices:
            query[device] = db_data[device].find({'ts': {'$gte': from_date, '$lte': to_date}}, {'_id': False}).sort('ts', -1)
        else:
          return Response('Parameter "to_date" must be greater than "from_date", not less or equal.', 400)

      else:
        for device in list_of_devices:
          query[device] = db_data[device].find({'ts': {'$gte': from_date}}, {'_id': False}).sort('ts', -1)

    # elif limit:
      # return_data = []
      # return_dict = {}
      # for device in list_of_devices:
      #   #query[device] = db_data[device].find(projection = {'_id': False}, limit = limit).sort('ts', -1)
      #   collection = db_data[device]
      #   #return_data.append(list(collection.find(projection = {'_id': False}, limit = limit).sort('ts', -1)))
      #   return_dict[device] = (list(collection.find(projection = {'_id': False}, limit = limit).sort('ts', -1)))
      # return return_dict

    elif limit:
      query = {}
      #print(user_data["devices"]["a1"]["id"])
      for device in list_of_devices:
        if 'id' in user_data["devices"][device].keys():
          #print(user_data["devices"][device]["id"])
          collection = db_data[user_data["devices"][device]["id"]]
          #query[device] = collection.find({'limit': limit})
          query[device] = list(collection.find(projection = {'_id': False}, limit = limit).sort('ts', -1))
      return query

    else:
      for device in list_of_devices:
        query[device] = db_data[device].find(projection = {'_id': False}).sort('ts', -1)

  if len(query) > 0:
    for device, pointer in query.items():
      device_data =[]
      for item in pointer:
        device_data.append(item)
      query[device] = device_data
    response = query

  return response

@router.post('/alerts') # Criar alerta
async def new_alert_old(login: str, request: Request, department: Optional[str] = None ):
  try:
    body = await request.json()
    alert = build_alert_logic(body)
    print(body)
  except Exception as e:
    print("----> Erro: ", e)
    return Response('Failed to parse request body.', 204)

  collection_users = db_metadata['users']
  collection_alerts = db_metadata['alerts']

  user_data = collection_users.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)
  else:
    for b in body['devices']:
      if b not in user_data['devices'].keys():
        return Response('One or more devices not found.', 404)

  try:
    for d in body['devices']:
      aux = collection_alerts.find_one({'device_eui': d}, {'_id': False})
      dev = build_alert_body(body, d)
      querry_string = 'alerts.' + body['name']

      if aux is not None:
        if body['name'] not in aux['alerts'].keys():
          collection_alerts.update_one({'device_eui': d}, {'$set': {querry_string: alert}})
          db_update()
          #return Response('New alert registered successfully.', 201)
        else:
          return Response('An alert with this name already exists.', 400)

      else:
        collection_alerts.insert_one(dev)
        collection_alerts.update_one({'device_eui': d}, {'$set': {querry_string: alert}})
        db_update()
        
    if department:
      print('Department detected')
      query_alerts_dict = {}
      query_str = 'alerts'
      if 'alerts' in user_data.keys():
        query_alerts_dict = user_data['alerts']
      query_alerts_dict[body['name']] = department
      collection_users.update_one({'login': login}, {'$set': {query_str: query_alerts_dict}})
      return Response('New alert registered successfully.', 201)

  except:
    return Response('Failed to insert new alert onto database.', 500)

@router.get('/alert_names')
async def get_alert_names(login: str):
  collection_users = db_metadata['users']
  collection_alerts = db_metadata['alerts']

  user_data = collection_users.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)
  user_devices = list(user_data['devices'].keys())
  alerts_list = list(collection_alerts.find({'device_eui': {'$in': user_devices}}, {'_id': False}))
  alerts_names = []
  alerts_list_aux = alerts_list[:]
  for i in range(len(alerts_list)):
    for j in alerts_list[i]['alerts']:
      alerts_names.append(j)
      j_aux = '@@**' + j
      j_aux = j_aux.replace('@@**', '')
      j_aux_no_space = j_aux.replace(' ', '_')
      alerts_list_aux[i]['alerts'] = ast.literal_eval(str(alerts_list_aux[i]['alerts']).replace(j_aux, j_aux_no_space))
  return alerts_names

@router.get('/alerts') 
async def get_alerts(login: str, dev_eui: Optional[str] = None, name: Optional[str] = None, department: Optional[str] = None):
  collection_users = db_metadata['users']
  collection_alerts = db_metadata['alerts']

  user_data = collection_users.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)

  if name:
    projection = 'alerts.' + name
    return list(collection_alerts.find({'alerts': {'$exists': name}}, {'_id': False, 'device_eui': True, projection: True, 'email': True}))

  if dev_eui:
    if dev_eui in user_data['devices'].keys():
      return collection_alerts.find_one({'device_eui': dev_eui}, {'_id': False})
    else:
      return Response('Device not found.', 404)
  if department and department != 'Todos':
    dev_eui_list = []
    for i in user_data['devices'].keys():
      if 'department' in user_data['devices'][i].keys():
        if department == user_data['devices'][i]['department']:
          dev_eui_list.append(i)
    print(dev_eui_list)
    alerts_list = list(collection_alerts.find({'device_eui': {'$in': dev_eui_list}}, {'_id': False}))
    alerts_names = []
    for i in range(len(alerts_list)):
      for j in alerts_list[i]['alerts']:
        dict_item = {}
        dict_item['device'] = alerts_list[i]['device_eui']
        dict_item['name'] = j
        dict_item['vars'] = alerts_list[i]['alerts'][j]['vars']
        dict_item['msg'] = alerts_list[i]['alerts'][j]['msg']
        dict_item['arg_1'] = alerts_list[i]['alerts'][j]['arg_1']
        dict_item['arg_2'] = alerts_list[i]['alerts'][j]['arg_2']
        dict_item['if'] = alerts_list[i]['alerts'][j]['if']
        alerts_names.append(dict_item)
    return alerts_names

  else:
    user_devices = list(user_data['devices'].keys())
    alerts_list = list(collection_alerts.find({'device_eui': {'$in': user_devices}}, {'_id': False}))
    alerts_names = []
    alerts_list_aux = alerts_list[:]
    for i in range(len(alerts_list)):
      for j in alerts_list[i]['alerts']:
        dict_item = {}
        dict_item['device'] = alerts_list[i]['device_eui']
        dict_item['name'] = j
        dict_item['vars'] = alerts_list[i]['alerts'][j]['vars']
        dict_item['msg'] = alerts_list[i]['alerts'][j]['msg']
        dict_item['arg_1'] = alerts_list[i]['alerts'][j]['arg_1']
        dict_item['arg_2'] = alerts_list[i]['alerts'][j]['arg_2']
        dict_item['if'] = alerts_list[i]['alerts'][j]['if']
        alerts_names.append(dict_item)
    return alerts_names

@router.put('/alerts') # Atualizar alerta
async def update_alert(login: str, name: str, dev_eui: str, request: Request):
  try:
    body = await request.json()
  except:
    return Response(status_code = 204)

  collection_alerts = db_metadata['alerts']
  collection_users = db_metadata['users']

  user_data = collection_users.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found.', 404)
  
  if dev_eui in user_data['devices'].keys():
    alert = collection_alerts.find_one({'device_eui': dev_eui})
    if name in alert['alerts'].keys():
      querry_string = 'alerts.' + name
      collection_alerts.update_one({'device_eui': dev_eui}, {'$set': {querry_string: body}})
      db_update()
      return Response('Alert updated successfully.', 200)
    else:
      return Response('Alert name not found.', 404)
  else:
    return Response('Device not found.', 404)

@router.delete('/alerts') # Deletar alerta
async def delete_alert(login: str, name: str, dev_eui: str):
  collection_users = db_metadata['users']
  collection_alerts = db_metadata['alerts']

  user_data = collection_users.find_one({'login': login}, {'_id': False})
  if user_data is None:
    return Response('User not found', 404)
  devices = [d for d in user_data['devices'].keys()]
  if dev_eui not in devices:
    return Response('Device not found', 404)
  try:
    querry_string = 'alerts.' + name
    collection_alerts.update_many({'device_eui': dev_eui}, {'$unset': {querry_string: name}})
    db_update()
    alerts_list = list(collection_alerts.find({'device_eui': dev_eui}, {'_id': False}))
    #print(len(alerts_list[0]['alerts']))
    if len(alerts_list[0]['alerts']) == 0:
      collection_alerts.delete_one({'device_eui': dev_eui})
    return Response('Alert removed successully.', 200)
  except:
    return Response('Alert not found.', 404)

@router.post('/user') # Cadastrar novo usuário
async def new_user(request: Request):
  try:
    print('----> Input: ') 
    body = await request.json()
    print(body)
    body = build_user(body)
    print('----> New User: ')
    print(body)
    aclfile = open('/etc/mosquitto/aclfile', 'a')
    aclfile.write('user ' + body['MQTTuser'])
    aclfile.write('\n')
    aclfile.write('topic ibti/' + body['MQTTuser'] + '/#')
    aclfile.write('\n')
    aclfile.close()
    #mqtt_pswd_file = open('/etc/mosquitto/password_temp', 'a')
    #mqtt_pswd_file.write('\n')
    #mqtt_pswd_file.write(body['MQTTuser'] + ':' + body['MQTTpsw'])
    #mqtt_pswd_file.close()
    #os.system('mosquitto_passwd -U /etc/mosquitto/password_temp')
    os.system('mosquitto_passwd -b /etc/mosquitto/password_temp ' + body['MQTTuser'] + ' ' + body['MQTTpsw']) 
    pid_mqtt = check_output(["pidof",'mosquitto'])
    #print('----> Kill: ' + 'kill -HUP ' + str(int(pid_mqtt)))
    os.system('/home/iotuser/plataforma/dados/update.sh ' + str(int(pid_mqtt)))
  except Exception as e:
    print('----> Erro: ', e)
    return Response('Failed to insert user information into database', 204)
  collection = db_metadata['users']

  user_data = collection.find_one({'login': body['key']}, {'_id': False})
  if user_data is None:
    result = collection.insert_one(body)
    if result.inserted_id is not None:
      return Response('User created successfully.', 201)
    else:
      return Response('Failed to insert user information into database.', 500)
  else:
    return Response('User already exists.', 400)

@router.get('/user') # Retorna usuário
async def get_user(login: str):
  collection = db_metadata['users']
  user = collection.find_one({'login': login}, {'_id': False})
  if user is not None:
    return user
  else:
    return Response('User not found.', 404)

@router.get('/vars')
async def get_vars(
  user: Optional[str] = None,
  login: Optional[str] = None,
  dev_type: Optional[str] = None):

  user_data = ''
  type_data = ''
  user_routine = False
  if login is None and user is not None: 
    print('----> login')
    user_data = db_metadata['users'].find_one({'user': user}, {'_id': False})
    user_routine = True
    if user_data is None:
      return Response('User not found.', 404)
  elif user is None and login is not None:
    print('----> user')
    user_data = db_metadata['users'].find_one({'login': login}, {'_id': False})
    user_routine = True
    if user_data is None:
      return Response('User not found.', 404)
  else:
    print('----> type')
    type_data = db_metadata['types'].find_one({'name': dev_type}, {'_id': False})

  #try:
  if user_routine:
    types =[]
    #print('----> User_data: ')
    #print(user_data)
    for i in user_data['devices'].keys():
      #print ('----> i: ' + i)
      if user_data['devices'][i]['type'] not in types:
        types.append(user_data['devices'][i]['type'])
    #print('----> Types: ')
    #(types)
    for i in range(len(types)):
      types[i] = db_metadata['types'].find_one({'name': types[i]}, {'_id': False})
    #print('----> Types: ')
    #print(types)
    var =[]
    var_item =[]
    for i in types:
      if i is not None:  
        print('----> Type name: ' + str(i['name']))
        temp_item = {}
        temp_item['type'] = str(i['name'])
        temp_item['variables'] = {}
        for j in i['variables'].keys():
          if 'unit' in i['variables'][j]:
            temp_item['variables'][j] = i['variables'][j]['unit']
          else:
            temp_item['variables'][j] = ''
        var_item.append(temp_item)
    print('----> Var_item: ')
    print(var_item)
    return var_item
  else:
    var =[]
    var_item =[]
    i = type_data
    if i is not None:
      print('----> Type name no user: ' + str(i))
      temp_item = {}
      temp_item['type'] = str(i['name'])
      temp_item['variables'] = {}
      for j in i['variables'].keys():
        if 'unit' in i['variables'][j]:
          temp_item['variables'][j] = i['variables'][j]['unit']
        else:
          temp_item['variables'][j] = ''
      var_item.append(temp_item)
    print('----> Var_item: ')
    print(var_item)
    return var_item

@router.get('/http_in')
async def http_payload_get(login: str, dev_eui: str, request: Request):
  collection = db_metadata['users']
  user = collection.find_one({'login': login}, {'_id': False})
  if user is None:
    return Response('User not found.', 404)
  else:
    if dev_eui not in user['devices']: 
      return Response('Device not registered.', 404)
    else:
      params = str(request.query_params)
      params = params.split('&')
      key_val_list = []
      params_dict = {}
      collection = db_metadata['types']
      type = collection.find_one({'name': user['devices'][dev_eui]['type']})
      if type is None:
        return Response('Type not found.', 404)
      else:
        variables = list(type['variables'].keys())
        print(variables)
        for i in params:
          key_val_list.append(i.split('='))
        ts = False
        for i in key_val_list:
          if i[0] in variables or i[0] == 'ts':
            params_dict[i[0]] = float(i[1])
          if i[0] == 'ts':
            ts = True
        if not ts:
          params_dict['ts'] = int(time.time())
        params_dict.pop('login', None)
        params_dict.pop('dev_eui', None)
        collection = db_data[user['devices'][dev_eui]['id']]
        collection.insert_one(params_dict)
        return str(params_dict)

@router.post('/http_in')
async def http_payload_get(login: str, dev_eui: str, request: Request):
  body = await request.json()
  collection = db_metadata['users']
  params_dict = {}
  user = collection.find_one({'login': login}, {'_id': False})
  if user is None:
    return Response('User not found.', 404)
  else:
    if dev_eui not in user['devices']: 
      return Response('Device not registered.', 404)
    else:
      collection = db_metadata['types']
      type = collection.find_one({'name': user['devices'][dev_eui]['type']})
      if type is None:
        return Response('Type not found.', 404)
      else:
        variables = list(type['variables'].keys())
        print(variables)
        ts = False
        for i in body.keys():
          if i in variables or i == 'ts':
            params_dict[i] = body[i]
          if i == 'ts':
            ts = True
        if not ts:
          params_dict['ts'] = int(time.time())
        params_dict.pop('login', None)
        params_dict.pop('dev_eui', None)
        collection = db_data[user['devices'][dev_eui]['id']]
        collection.insert_one(params_dict)
        return str(params_dict)

@router.put('/http_in')
async def http_payload_put(login: str, dev_eui: str, request: Request):
  try: 
    body = await request.json()
    print(body)
  except:
    return Response(status_code = 204)
  collection = db_metadata['users']
  user = collection.find_one({'login': login}, {'_id': False})
  if user is None:
    return Response('User not found.', 404)
  else:
    if dev_eui not in user['devices']: 
      return Response('Device not registered.', 404)
    else:
      key_val_list = list(body.keys())
      params_dict = {} 
      collection = db_metadata['types']
      type = collection.find_one({'name': user['devices'][dev_eui]['type']})
      if type is None:
        return Response('Type not found.', 404)
      else:
        variables = list(type['variables'].keys())
        print(variables)
        ts = False
        for i in key_val_list:
          if i in variables or i == 'ts':
            params_dict[i] = body[i]
          if i == 'ts':
            ts = True
        if not ts:
          params_dict['ts'] = int(time.time())
        params_dict.pop('login', None)
        params_dict.pop('dev_eui', None)
        collection = db_data[user['devices'][dev_eui]['id']]
        collection.insert_one(params_dict)
        return str(params_dict)

@router.get('/sigfox_in')
async def sigfox_payload_get(login: str, dev_eui: str, request: Request, data: str, ts: Optional[str] = None):
  collection = db_metadata['users']
  user = collection.find_one({'login': login}, {'_id': False})
  if user is None:
    return Response('User not found.', 404)
  else:
    if dev_eui not in user['devices']: 
      return Response('Device not registered.', 404)
    else:
      if data is None:
        return Response('Data key is empty.', 404)
      else:
        collection = db_metadata['types']
        type = collection.find_one({'name': user['devices'][dev_eui]['type']})
        if type is None:
          return Response('Type not found.', 404)
        else:
          variables = list(type['variables'].keys())
          print(variables)
          if ts is None:
            ts = int(time.time())
            sigfox_dict = {}
            sigfox_dict['ts'] = ts
            sigfox_dict['data'] = data
            saida = decoder_sigfox_v2.Decode.decode(sigfox_dict, type)
            collection = db_data[user['devices'][dev_eui]['id']]
            collection.insert_one(saida)
            return str(saida)

@router.get('/metabase_url') # Embed do Metabase
async def get_metabase_url(login: str):
  collection = db_metadata['users']
  user = collection.find_one({'login': login}, {'_id': False})
  # devices_list = []
  # devices_list.append('98bb0a3a36f2e3e7')
  # devices_list.append('a1')
  if user is None:
    return Response('User not found.', 404)
  else:
    METABASE_SITE_URL = "https://metabase-iotibti.ddns.net"
    METABASE_SECRET_KEY = config.metabase_secret_key
    payload = {
      "resource": {"dashboard": 2},
      "params": {
        "login": login
      }
      #"exp": round(time.time()) + (60 * 10) # 10 minute expiration
    }
    token = jwt.encode(payload, METABASE_SECRET_KEY, algorithm="HS256")
    print(token)
    iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + str(token).replace('b\'', '').replace('\'','') + "#bordered=true&titled=true&theme=null"
    return (iframeUrl)
