from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items

def find_one(key, value):
    return amz_items.find_one({key: value})

def find_all():
    return list(amz_items.find({}))

if __name__ == "__main__":
    print(find_one("model", "Teddy Bear"))
    print(find_one("asin", "9876543210"))
    print(find_all())
    print(find_one("key", "val"))   # returns None