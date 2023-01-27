from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items


def get_items():
    items = dumps(list(amz_items.find({})))
    return JsonResponse(items, safe=False)
