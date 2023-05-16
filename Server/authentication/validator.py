from pymongo import MongoClient
from collections import OrderedDict

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

auth = db.auth

schema = {"$jsonSchema":
          {
              "bsonType": "object",
              "required": ["username", "password", "companyId"],
              "additionalProperties": False,
              "properties": {
                  "_id": {  # Auto populated by mongo
                      "bsonType": "objectId"
                  },
                  "email": {
                      "description": "Encrypted email address"
                  },
                  "username": {
                      "bsonType": "string",
                      "minLength": 4,
                      "maxLength": 20,
                      "description": "must be a string of length 4-20 and is required"
                  },
                  "password": {
                      "bsonType": "string",
                      "minLength": 4,
                      "maxLength": 100,
                      "description": "must be a string and is required"
                  },
                  "companyId": {
                      "bsonType": "objectId",
                      "description": "Mapping to company and is required"
                  },
                  "lastLogin": {
                      "description": "Last login time"
                  }
              }
          }
          }

cmd = OrderedDict([('collMod', 'auth'),
                   ('validator', schema)])
# cmd = {'collMod': 'amz_items', 'validator': schema}
# in exactly that order (order matters)
# collMod stands for collection modify
db.command(cmd)
print("Validator Updated")

# Enforces that "asin" field is unique value
auth.create_index("username", unique=True)
print("Index Updated")

