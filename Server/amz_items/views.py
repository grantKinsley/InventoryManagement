from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers

import json
# Create your views here.


@csrf_exempt
def amz_items(request):
    try:
        if request.method == 'GET':
            return controllers.get_items()
        if request.method == 'POST':
            body_as_dict = json.loads(request.body.decode('utf-8'))
            return controllers.create_item(body_as_dict)
    except Exception as err:
        return JsonResponse({"Error 404": f"Something went wrong. {err}"})


# Security token with csrf (supposed to stop people from hijacking your browser)
# Disabled for now but maybe try re-enabling later
# CSRF error occurs on postman delete
@csrf_exempt
def amz_item(request, asin):
    try:
        if request.method == 'GET':
            return controllers.get_item(asin)
        if request.method == 'DELETE':
            return controllers.delete_item(asin)
        if request.method == 'PATCH':
            return  # todo
    except Exception as err:
        return JsonResponse({"Error 404": f"Something went wrong. {err}"})
