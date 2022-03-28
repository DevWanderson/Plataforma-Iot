import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import ssl_support

from credentials import mongodb_address
from db import DatabaseConnector
from router import router, set_databases
from utils import handle_args

dotenv_path = os.path.join(os.path.dirname(__file__), "./settings/.env.src")
load_dotenv(dotenv_path)

MONGODB_ADDRESS = os.environ.get("MONGODB_ADDRESS")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

connector = DatabaseConnector().connect(MONGODB_ADDRESS)
set_databases()

args = handle_args()

if __name__ == "__main__":

    if args["ssl"]:
        args["ssl_keyfile"] = os.environ.get("SSL_KEYFILE")
        args["ssl_certfile"] = os.environ.get("SSL_CERTFILE")

        uvicorn.run(
            "server:app",
            host=args.get("host"),
            port=int(args.get("port")),
            reload=args.get("reload"),
            ssl_keyfile=args.get("ssl_keyfile"),
            ssl_certfile=args.get("ssl_certfile"),
        )

    else:
        uvicorn.run(
            "server:app",
            host=args.get("host"),
            port=int(args.get("port")),
            reload=args.get("reload"),
        )
