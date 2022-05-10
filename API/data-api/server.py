from pymongo import ssl_support
import uvicorn
from credentials import mongodb_address
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sys import argv
from utils import Params
from db import DatabaseConnector
from router import router, set_databases

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins = ['*'], allow_credentials = True, allow_methods = ['*'], allow_headers = ['*'])
app.include_router(router)

connector = DatabaseConnector().connect(mongodb_address)
set_databases()

params = Params.default_params()
if len(argv) > 1:
  params = Params.console_params(argv)

if __name__ == '__main__':
    uvicorn.run('server:app', host = params ['host'], port = params ['port'], reload = True, ssl_certfile = params ['ssl_certfile'], ssl_keyfile = params ['ssl_keyfile'])
#, ssl_support = True)  
