from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

post = {"Hello_World": "Hello MongoDB"}

posts = db.posts
post_id = posts.insert_one(post).inserted_id
print(post_id)
