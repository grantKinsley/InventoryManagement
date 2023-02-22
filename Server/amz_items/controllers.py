from django.http import JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps
from bson import ObjectId

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items


def get_items(token):
    # Cursor Object -> list -> JSON
    # Reponds with string representation of JSON object
    # Frontend javascript can parse with JSON.parse
    items = dumps(
        list(amz_items.find({"companyId": ObjectId(token.get("companyId"))})))
    return JsonResponse(items, safe=False)


def get_item(asin, token):
    item = amz_items.find_one({"asin": asin})
    assert (str(item["companyId"]) == token.get("companyId"))
    item = dumps(item)
    return JsonResponse(item, safe=False)


def create_item(item, token):
    item["companyId"] = ObjectId(token.get("companyId"))
    amz_items.insert_one(item).inserted_id
    return JsonResponse({"Success": f"Document with asin {item['asin']} created"})


def delete_item(asin, token):
    item = amz_items.find_one({"asin": asin})
    assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.delete_one({'asin': asin})
    return JsonResponse({"Success": f"Document with asin {asin} deleted"})


def patch_item(asin, new_params, token):
    item = amz_items.find_one({"asin": asin})
    assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.update_one(
        {"asin": asin}, {"$set": new_params})
    return JsonResponse({"Success": f"Document with asin {asin} updated"})

def get_list():
    items = list(amz_items.find({}))
    return items
def get_list_search(asin):
    items = list(amz_items.find({"asin": asin}))
    return items