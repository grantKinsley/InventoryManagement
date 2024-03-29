from django.http import JsonResponse
from pymongo import MongoClient, UpdateOne, InsertOne
from bson.json_util import dumps
from bson import ObjectId
from dateutil import parser
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
    item = amz_items.find_one({"ASIN": asin, 'companyId': ObjectId(token.get('companyId'))})
    assert (str(item["companyId"]) == token.get("companyId"))
    item = dumps(item)
    return JsonResponse(item, safe=False)


def delete_all(token):
    companyId = ObjectId(token.get("companyId"))
    amz_items.delete_many({"companyId": companyId})
    priceTimeSeries.delete_many({"companyId":companyId})
    return JsonResponse("Deleted all company documents", safe=False)


def create_item(body, token):
    print(body)
    upsert_operations = []
    time_series_operations = []
    failed_documents = []
    # For loop expects body to be a list of dictionaries. dict key values are csv column names
    curTime = datetime.datetime.now()
    for item in body:
        
        item["companyId"] = ObjectId(token.get("companyId"))
        if "sellingPrice" in item:
            item["sellingPrice"] = (float)(item["sellingPrice"])
        if "cost" in item:
            item["cost"] = (float)(item["cost"])
        # if("asin" in item):
        #     item["ASIN"] = item["asin"]
        #     del item["asin"]
        if("modelName" in item):
            item["Product Title"] = item["modelName"]
            del item["modelName"]
        print(item)
        try:
            # priceTimeSeries.insert_one({
            #     'metadata': {'ASIN': item["ASIN"], 'companyID': ObjectId(token.get('companyId'))},
            #     'timestamp': datetime.datetime.now(),
            #     'price': item['sellingPrice']
            # })
            print(
                f"VALIDATING:{mongo_schema.validate(item, validator.schema.get('$jsonSchema'))}")
            # #Upsert updates if data is there, inserts otherwise
            if "" in item:
                item.pop("")
            upsert_operations.append(
                UpdateOne({"ASIN": item["ASIN"], 'companyId': ObjectId(token.get('companyId'))}, {"$set": item}, upsert=True))
            old_item = amz_items.find_one({"ASIN": item["ASIN"], 'companyId': ObjectId(token.get('companyId'))})
            if old_item:
                old_item.update(item)
                item = old_item
            item['metadata'] = {'ASIN': str(item["ASIN"]),
                                'companyId': ObjectId(token.get('companyId'))}
            item['timestamp'] = curTime
            item['price'] = 25 if 'sellingPrice' not in item and 'price' not in item else item['sellingPrice']
            time_series_operations.append(
                InsertOne(item)
            )
            print("DONE")

        except Exception as err:
            print(f"VALIDATION FAILED: {err}")
            failed_documents.append(item)
    print(len(upsert_operations), upsert_operations)
    amz_items.bulk_write(upsert_operations)
    priceTimeSeries.bulk_write(time_series_operations)
    return JsonResponse({"Success": f"{len(upsert_operations)} documents created"})


def delete_item(asin, token):
    print("HERE")
    item = amz_items.find_one({"ASIN": asin})
    print(item, token.get("companyId"))
    #assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.delete_one({"ASIN": asin, "companyId": ObjectId(token.get("companyId"))})
    return JsonResponse({"Success": f"Document with asin {asin} deleted"})


def patch_item(asin, new_params, token):
    item = amz_items.find_one({"ASIN": asin, 'companyId': ObjectId(token.get('companyId'))})
    assert (str(item["companyId"]) == token.get("companyId"))
    amz_items.update_one(
        {"ASIN": asin, 'companyId': ObjectId(token.get('companyId'))}, {"$set": new_params})
    return JsonResponse({"Success": f"Document with asin {asin} updated"})


def get_list():
    items = list(amz_items.find({}))
    return items


def get_list_search(token):
    items = list(amz_items.find(
        {"companyId": ObjectId(token.get("companyId"))}))
    return items


def getTimeSeries(asin, token):
    # items  = list(priceTimeSeries.find({"metadata": {"ASIN" : asin,"companyId": ObjectId(token.get("companyId"))}}))
    # items  = list(priceTimeSeries.find({$and:[{"metadata.ASIN": asin}, {"metadata.ASIN": asin}]}))
    items = list(priceTimeSeries.find({"metadata.ASIN": 
        str(asin), "metadata.companyId": ObjectId(token.get("companyId"))}))
    print(items)
    return JsonResponse(dumps(items), safe=False)

def get_asins(token):
    asins = amz_items.find(
        {"companyId": ObjectId(token.get("companyId"))}, 
        { "ASIN": 1, "_id": 0 })
    res = [x['ASIN'] for x in asins]
    print(res)
    return JsonResponse(res, safe=False)

def get_general_history(start,end,token):
    # Parser should be able to parse any sort of datetime format you throw at it. 
    # In frontend, use javascript Date toJson method before sending to backend (not confirmed that it works yet)
    # Checked that date works when format is "Y-M-D H:M:S.SOMETHING" eg 2023-05-22 13:55:31.406482
    start = parser.parse(start)
    end = parser.parse(end)
    items = list(priceTimeSeries.find(
        {"metadata.companyId": ObjectId(token.get("companyId")), 
        #  "timestamp": {"$lte": end}}
            "timestamp": {"$gte": start, "$lte":end}}
         ))
    # Use the below prints to 
    # total_items = list(priceTimeSeries.find({"metadata.companyId": ObjectId(token.get("companyId"))}))
    # print("LENGTH QUERY", len(items))
    # print("LENGTH ALL", len(total_items))
    return JsonResponse(dumps(items), safe=False)