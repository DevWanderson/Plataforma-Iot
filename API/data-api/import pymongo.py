import pymongo

myclient = pymongo.MongoClient("mongodb://####:####@localhost:27017/")
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
