from pymongo import MongoClient
from collections import OrderedDict

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items

schema = {"$jsonSchema":
          {
              "bsonType": "object",
              "required": ["ASIN", "companyId"],
              "additionalProperties": True,
              "properties": {
                  "_id": {  # Auto populated by mongo
                      "bsonType": "objectId"
                  },
                  "ASIN": {
                      "bsonType": "string",
                      "minLength": 10,
                      "maxLength": 10,
                      "description": "must be a string of length 10 and is required"
                  },
                  "model": {
                      "bsonType": "string",
                      "description": "must be a string and is required"
                  },
                  "sellingPrice": {
                      "bsonType": "double",
                      "minimum": 0.0,
                      "description": "must be a float and is required"
                  },
                  "cost": {
                      "bsonType": "double",
                      "minimum": 0.0,
                      "description": "must be a float and is required"
                  },
                  "amzInv": {
                      "bsonType": "int",
                      "minimum": 0,
                      "description": "must be an int and is required"
                  },
                  "salesRate": {
                      "bsonType": "int",
                      "description": "must be an int"
                  },
                  "companyId": {
                      "bsonType": "objectId",
                      "description": "Mapping to company and is required"
                  }

                  #  "year": {
                  #      "bsonType": "int",
                  #      "minimum": 2017,
                  #      "maximum": 3017,
                  #      "exclusiveMaximum": False,
                  #      "description": "must be an integer in [ 2017, 3017 ] and is not required"
                  #  },
                  #  "major": {
                  #      "enum": ["Math", "English", "Computer Science", "History", None],
                  #      "description": "can only be one of the enum values and is not required"
                  #  },
                  #  "gpa": {
                  #      # In case you might want to allow doubles OR int, then add
                  #      # "int" to the bsonType array below:
                  #      "bsonType": ["double"],
                  #      "minimum": 0,
                  #      "description": "must be a double and is not required"
                  #  }
              }
          }
          }

cmd = OrderedDict([('collMod', 'amz_items'),
                   ('validator', schema)])
# cmd = {'collMod': 'amz_items', 'validator': schema}
# in exactly that order (order matters)
# collMod stands for collection modify
db.command(cmd)
print("Validator Updated")

# Enforces that "asin" field is unique value
amz_items.create_index("ASIN", unique=True)
print("Index Updated")
