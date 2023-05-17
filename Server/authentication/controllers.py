from django.http import JsonResponse
from pymongo import MongoClient
from bson.json_util import dumps
from bson import ObjectId
from aes_cipher import DataEncrypter, DataDecrypter
import json
import bcrypt
import jwt
import datetime
import logging
import hashlib

SECRET_KEY = "CHANGEMELATER"

client = MongoClient(
    "mongodb+srv://inventory-user:sUlruqlhO7bfCfFj@inventory-cluster.acpnb7c.mongodb.net/?retryWrites=true&w=majority")

db = client["inventory-cluster"]

auth = db.auth
companies = db.companies
logger = logging.getLogger("user-auth")

def genToken(username, companyId):
    expiration_date = datetime.datetime.now(
        tz=datetime.timezone.utc) + datetime.timedelta(hours=1)
    token = jwt.encode(
        {"username": username, "companyId": str(companyId), "exp": expiration_date}, SECRET_KEY, algorithm="HS256")
    return token


def login(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    body = json.loads(request.body.decode('utf-8'))
    username = body.get("username")

    user_document = auth.find_one({"username": username})
    if user_document == None:
        return JsonResponse({"Error": "Username does not exist", "Status": 402})

    companyId = str(user_document.get("companyId"))
    password = body.get("password").encode()
    hashed_password = user_document.get("password").encode()

    numAttempts = user_document['loginAttempts']

    if not bcrypt.checkpw(password, hashed_password):
        logger.info("Failed login to " + username + " from " + ip)
        auth.update_one({"username": username}, { "$inc": { "loginAttempts": 1 }})
        
        if numAttempts >= 5:
            return JsonResponse({"Error": "Your account has been locked", "Status": 403})
        
        return JsonResponse({"Error": "Incorrect Password", "loginAttempts":numAttempts+1, "Status": 401})
    curTime = datetime.datetime.now()
    auth.update_one({"username": username}, { "$set": { 'lastLogin': curTime, 'loginAttempts': 0 } })
    logger.info("Successful login to " + username + " from " + ip)
    return JsonResponse({"token": genToken(username, companyId)})


def register(request):
    
    body = json.loads(request.body.decode('utf-8'))
    print("STARTING HASH")
    data_encrypter = DataEncrypter()
    print("CLASS CREATED")
    data_encrypter.Encrypt(body.get("email"), "CHANGEMELATER")
    print("ENCRYPTION COMPLETE")
    # print(str(data_encrypter.GetEncryptedData()), body.get("email"))
    body["email"] = data_encrypter.GetEncryptedData()
    # data_decrypter = DataDecrypter()
    # data_decrypter.Decrypt(body['email'], "CHANGEMELATER")
    # print(str(data_decrypter.GetDecryptedData()))
    print("ENDING HASH")
    username = body.get("username")
    prevUser = auth.find_one({"username": username})
    if prevUser:
        return JsonResponse({"Error": f'User {body.get("username")} already exists.'}, status=409)
    prevUser = auth.find_one({"email": body.get('email')})
    if prevUser:
        return JsonResponse({"Error": f'Email already exists.'}, status=409)
    # assert ("companyName" in body)
    # company = companies.insert_one({"name": body.get("companyName")})
    # body["companyId"] = company.inserted_id
    # del body["companyName"]
    password = body.get("password").encode()
    assert (password != None)
    password = bcrypt.hashpw(password, bcrypt.gensalt()).decode()
    body["password"] = password
    curTime = datetime.datetime.now()
    body["lastLogin"] = curTime
    body["loginAttempts"] = 0
    auth.insert_one(body)
    return JsonResponse({"Success": f"User {body.get('username')} created", "token": genToken(body.get("username"), "")})


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
