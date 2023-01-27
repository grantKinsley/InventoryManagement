from django.http import HttpResponse, JsonResponse
from . import controllers
# Create your views here.


def amz_items(request):
    try:
        # Cursor Object -> list -> JSON
        # Reponds with string representation of JSON object
        # Frontend javascript can parse with JSON.parse
        if request.method == 'GET':
            return controllers.get_items()
        if request.method == 'POST':
            return  # todo
    except:
        return JsonResponse({"Error 404": "Something went wrong"})
    # return JsonResponse({"Response": "Hello World! This is amz_items"})
