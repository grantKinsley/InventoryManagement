from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers
from . import middleware
import json

# Create your views here.


# Route: /amazon_api/
@csrf_exempt
@middleware.authentication_required
def get_order_by_id(request):
    try:
        token = request.META.get("decoded_token")
        body = json.loads(request.body.decode('utf-8'))
        orderId = body.get("orderId")
        print("Order Id: %d" % orderId)
        if request.method == 'GET':
            return controllers.get_order_by_id(token, orderId)
        else:
            return JsonResponse({"Error:": "Invalid Endpoint Request"})
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})
