
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers

# Create your views here.


# Route: /auth/login
@csrf_exempt
def login(request):
    try:
        if request.method == 'POST':
            return controllers.login(request)
        else:
            return JsonResponse({"Error 404": f"Invalid requst type"}, status=400)
    except Exception as err:
        print(err)
        return JsonResponse({"Error": "Login attempt failed"}, status=401)


@csrf_exempt
def register(request):
    try:
        if request.method == 'POST':
            return controllers.register(request)
        else:
            return JsonResponse({"Error 404": f"Invalid requst type"}, status=400)
    except Exception as err:
        print(err)
        return JsonResponse({"Error": f"{err}"}, status=400)
