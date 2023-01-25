from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_item = {"asin": "abcdefghij", "model": "Big Bear"}

amz_items = db.amz_items
post_id = amz_items.insert_one(amz_item).inserted_id
print(post_id)
