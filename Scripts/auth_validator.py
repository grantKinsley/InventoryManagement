from pymongo import MongoClient
from collections import OrderedDict

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

auth = db.auth

schema = {"$jsonSchema":
          {
              "bsonType": "object",
              "required": ["username", "password", "company"],
              "additionalProperties": False,
              "properties": {
                  "_id": {  # Auto populated by mongo
                      "bsonType": "objectId"
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
                  "company": {
                      "bsonType": "string",
                      "minLength": 4,
                      "maxLength": 20,
                      "description": "must be a string and is required"
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
