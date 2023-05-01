from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items

priceTimeSeries = db.priceTimeSeries

def find_one(key, value):
    return amz_items.find_one({key: value})

def find_all():
    return list(amz_items.find({}))

def findMostRecent():
    mostRecentObj = priceTimeSeries.find_one({"metadata.ASIN":"ASINTEST69"},sort=[("timestamp",-1)])
    print(mostRecentObj)
    return
    if not mostRecentObj:
        return None
    ID = mostRecentObj["_id"]
    print(ID)
    print(priceTimeSeries.find_one({"_id": ID}))

if __name__ == "__main__":
    # print(find_one("model", "Teddy Bear"))
    # print(find_one("asin", "9876543210"))
    # print(find_all())
    # print(find_one("key", "val"))   # returns None
    # print(priceTimeSeries.find_one({"metadata.ASIN":"ASINTEST01"},{"sort":{"timestamp":-1},}))
    # print(priceTimeSeries.find_one({"metadata.ASIN":"ASINTEST01"}))
    findMostRecent()