from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers
# Create your views here.


def amz_items(request):
    try:
        if request.method == 'GET':
            return controllers.get_items()
        if request.method == 'POST':
            return  # todo
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
