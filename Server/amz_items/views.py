from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers
import json
import csv
import pandas as pd
# Create your views here.


# Route: /amz_items/
@csrf_exempt
def amz_items(request):
    try:
        if request.method == 'GET':
            return controllers.get_items()
        if request.method == 'POST':
            # json bytes -> decode utf8 -> json.loads -> dict
            body_as_dict = json.loads(request.body.decode('utf-8'))
            return controllers.create_item(body_as_dict)
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})


# Security token with csrf (supposed to stop people from hijacking your browser)
# Disabled for now but maybe try re-enabling later
# CSRF error occurs on postman delete
# Route: /amz_items/:asin
@csrf_exempt
def amz_item(request, asin):
    try:
        if request.method == 'GET':
            return controllers.get_item(asin)
        if request.method == 'DELETE':
            return controllers.delete_item(asin)
        if request.method == 'PATCH':
            update_params = json.loads(request.body.decode('utf-8'))
            return controllers.patch_item(asin, update_params)
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})


@csrf_exempt
def write_report(request):
    try:
        if request.method == 'GET':
            # response = HttpResponse(
            #     content_type='text/csv',
            #     headers={'Content-Disposition:' 'attachment; filename="report.csv"'}
            # )

            # jsonString = controllers.get_item(asin)
            # df = pd.DataFrame(jsonString)
            # df.pop("_id")
            # csv = df.to_csv('CSV_output.csv', index = False)

            # writer = csv.writer(response)
            # for row in csv:
            #     writer.writerow(row)

            # return HttpResponse("reporting on asin %s" % asin)
            return HttpResponse("got to write_report")
            # return response
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})
