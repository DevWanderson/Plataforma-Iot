# import pymongo
# import config

# target_mongo = pymongo.MongoClient(config.mongo_pitunnel)
# local_mongo = pymongo.MongoClient(config.mongo_uri)

# class sync:
#     def sync_mongo(db, collection):
#         db_target = target_mongo[db]
#         col_target = db_target[collection]
#         db_local = local_mongo[db]
#         col_local = db_local[collection]
#         cursor = col_local.find()
#         list_target = []
#         list_local = []
#         for i in cursor:
#             list_local.append(i)
#             #print (i)
#         cursor = col_target.find()
#         for i in cursor:
#             list_target.append(i)
#             #print (i)
#         for target in list_target: #insert target dicts in local collection
#             x = col_local.insert_one(target)

# db_target = target_mongo['data']
# for i in db_target.list_collection_names():
#     print(i)
#     sync.sync_mongo("data", i)
