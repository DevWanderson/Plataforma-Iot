from pymongo import MongoClient
from py_singleton import singleton

@singleton
class DatabaseConnector ():
  def __init__ (self):
    self.client = None

  def connect (self, address):
    try:
      self.client = MongoClient (address)
      print ('--> CONNECTED TO MONGODB CLIENT')
      
    except Exception as err:
      print (f'--> FAILED TO CONNECT TO MONGODB CLIENT:\n{err}')

  def get_databases (self, *args):
    return [self.client [db] for db in args]