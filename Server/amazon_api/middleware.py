import functools
import jwt
from django.http import JsonResponse

SECRET_KEY = "CHANGEMELATER"


def authentication_required(view_func):
    @functools.wraps(view_func)
    def authenticate(request, *args, **kwargs):
        token = request.META.get("HTTP_BEARER")
        try:
            decoded_token = jwt.decode(
                token, SECRET_KEY, algorithms=["HS256"])
            request.META["decoded_token"] = decoded_token
            return view_func(request, *args, **kwargs)
        except Exception as err:
            print(err)
            return JsonResponse({"Error": "Please log in again"}, status=401)
    return authenticate
