from django.http import JsonResponse
from pymongo import MongoClient, UpdateOne
from bson.json_util import dumps
from bson import ObjectId
import datetime

from . import validator  # nopep8
import mongo_schema

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

amz_items = db.amz_items

priceTimeSeries = db.priceTimeSeries


def get_items(token):
    # Cursor Object -> list -> JSON
    # Reponds with string representation of JSON object
    # Frontend javascript can parse with JSON.parse
    items = dumps(
        list(amz_items.find({"companyId": ObjectId(token.get("companyId"))})))
    return JsonResponse(items, safe=False)


def get_item(asin, token):
    item = amz_items.find_one({"ASIN": asin})
    assert (str(item["companyId"]) == token.get("companyId"))
    item = dumps(item)
    return JsonResponse(item, safe=False)


def delete_all(token):
    companyId = ObjectId(token.get("companyId"))
    amz_items.delete_many({"companyId": companyId})
    return JsonResponse("Deleted all company documents", safe=False)


def create_item(body, token):
    upsert_operations = []
    failed_documents = []
    #For loop expects body to be a list of dictionaries. dict key values are csv column names
    for item in body:
        print(item)
        item["companyId"] = ObjectId(token.get("companyId"))

        try:
            priceTimeSeries.insert_one({
                'metadata': {'ASIN': item["ASIN"], 'companyID': ObjectId(token.get('companyId'))},
                'timestamp': datetime.datetime.now(),
                'price': item['sellingPrice']
            })
            # print(
            #     f"VALIDATING:{mongo_schema.validate(item, validator.schema.get('$jsonSchema'))}")
            # #Upsert updates if data is there, inserts otherwise
            if "" in item:
                item.pop("")
            upsert_operations.append(
                UpdateOne({"ASIN": item["ASIN"]}, {"$set": item}, upsert=True))
            
            
            print("DONE")

        except Exception as err:
            print(f"VALIDATION FAILED: {err}")
            failed_documents.append(item)
    print(len(upsert_operations), upsert_operations)
    res = amz_items.bulk_write(upsert_operations)
    # print(res)
    return JsonResponse({"Success": f"{len(upsert_operations)} documents created"})


def delete_item(asin, token):
    print("HERE")
    item = amz_items.find_one({"ASIN": asin})
    print(item, token.get("companyId"))
    assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.delete_one({"ASIN": asin})
    return JsonResponse({"Success": f"Document with asin {asin} deleted"})


def patch_item(asin, new_params, token):
    item = amz_items.find_one({"ASIN": asin})
    assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.update_one(
        {"ASIN": asin}, {"$set": new_params})
    return JsonResponse({"Success": f"Document with asin {asin} updated"})


def get_list():
    items = list(amz_items.find({}))
    return items


def get_list_search(token):
    items = list(amz_items.find({"companyId": ObjectId(token.get("companyId"))}))
    return items
