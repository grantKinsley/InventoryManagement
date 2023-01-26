from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items

def update_one(query, update):
    return amz_items.update_one({query["key"]: query["val"]}, 
                      { "$set": {update["key"]: update["val"]} })

if __name__ == "__main__":
    query = {"key": "model",
             "val": "Big Bear"}
    update = {"key": "model",
              "val": "small bear"}
    # print(query["key"], query["val"])
    # print(update['key'], update["val"])
    print(update_one(query, update))