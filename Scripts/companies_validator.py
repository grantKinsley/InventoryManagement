from pymongo import MongoClient
from collections import OrderedDict

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

companies = db.companies

schema = {"$jsonSchema":
          {
              "bsonType": "object",
              "required": ["name"],
              "additionalProperties": False,
              "properties": {
                  "_id": {  # Auto populated by mongo
                      "bsonType": "objectId"
                  },
                  "name": {
                      "bsonType": "string",
                      "minLength": 1,
                      "maxLength": 50,
                      "description": "must be a string of length 4-20 and is required"
                  },
              }
          }
          }

cmd = OrderedDict([('collMod', 'companies'),
                   ('validator', schema)])
# cmd = {'collMod': 'amz_items', 'validator': schema}
# in exactly that order (order matters)
# collMod stands for collection modify
db.command(cmd)
print("Validator Updated")

# Enforces that "asin" field is unique value
# companies.create_index("username", unique=True)
# print("Index Updated")
