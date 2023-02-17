from django.http import JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps
import json
import bcrypt
import jwt
import datetime

SECRET_KEY = "CHANGEMELATER"

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

auth = db.auth


def login(request):
    body = json.loads(request.body.decode('utf-8'))
    username = body.get("username")

    user_document = auth.find_one({"username": username})
    if user_document == None:
        return JsonResponse({"Error": "Invalid Username and/or Password"})

    password = body.get("password").encode()
    hashed_password = user_document.get("password").encode()

    if not bcrypt.checkpw(password, hashed_password):
        return JsonResponse({"Error": "Invalid Username and/or Password"})

    expiration_date = datetime.datetime.now(
        tz=datetime.timezone.utc) + datetime.timedelta(hours=1)
    token = jwt.encode(
        {"username": username, "exp": expiration_date}, SECRET_KEY, algorithm="HS256")

    return JsonResponse({"token": token})


def register(request):
    body = json.loads(request.body.decode('utf-8'))
    password = body.get("password").encode()
    assert (password != None)
    password = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
    body["password"] = password
    auth.insert_one(body)
    return JsonResponse({"Success": f"User {body.get('username')} created"})


# def get_items():
#     # Cursor Object -> list -> JSON
#     # Reponds with string representation of JSON object
#     # Frontend javascript can parse with JSON.parse
#     items = dumps(list(amz_items.find({})))
#     return JsonResponse(items, safe=False)


# def get_item(asin):
#     item = dumps(amz_items.find_one({"asin": asin}))
#     return JsonResponse(item, safe=False)


# def create_item(item):
#     amz_items.insert_one(item).inserted_id
#     return JsonResponse({"Success": f"Document with asin {item['asin']} created"})


# def delete_item(asin):
#     amz_items.delete_one({'asin': asin})
#     return JsonResponse({"Success": f"Document with asin {asin} deleted"})


# def patch_item(asin, new_params):
#     amz_items.update_one(
#         {"asin": asin}, {"$set": new_params})
#     return JsonResponse({"Success": f"Document with asin {asin} updated"})
