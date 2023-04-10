from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import controllers
from . import middleware
import json
import csv as CSV

# Create your views here.


# Route: /amz_items/
@csrf_exempt
@middleware.authentication_required
def amz_items(request):
    try:
        token = request.META.get("decoded_token")
        if request.method == 'GET':
            return controllers.get_items(token)
        if request.method == 'POST':
            body = json.loads(request.body.decode('utf-8'))
            if type(body) == dict:
                body = [body]
            return controllers.create_item(body, token)
        if request.method == 'DELETE':
            return controllers.delete_all(token)
        else:
            return JsonResponse({"Error 404": f"Invalid requst type"}, status=400)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"}, status=404)


# Security token with csrf (supposed to stop people from hijacking your browser)
# Disabled for now but maybe try re-enabling later
# CSRF error occurs on postman delete
# Route: /amz_items/:asin
@csrf_exempt
@middleware.authentication_required
def amz_item(request, asin):
    try:
        token = request.META.get("decoded_token")
        if request.method == 'GET':
            return controllers.get_item(asin, token)
        if request.method == 'DELETE':
            return controllers.delete_item(asin, token)
        if request.method == 'PATCH':
            update_params = json.loads(request.body.decode('utf-8'))
            return controllers.patch_item(asin, update_params, token)
        else:
            return JsonResponse({"Error 404": f"Invalid requst type"}, status=400)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"}, status=404)


@csrf_exempt
@middleware.authentication_required
def write_report(request):
    try:
        if request.method == 'GET':
            token = request.META.get("decoded_token")
            lis = controllers.get_list_search(token)
            #lis = controllers.get_list()
            return downloadCSV(lis)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"})


def write_report_search(request, asin):
    try:
        if request.method == 'GET':

            lis = controllers.get_list_search(asin)
            return downloadCSV(lis)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"})


def downloadCSV(lis):
    try:
        response = HttpResponse(
            content_type='text/csv',
            headers={
                'Content-Disposition': 'attachment; filename="somefilename.csv"'},
        )
        writer = CSV.writer(response)

        # For exlcuding columns assuming the column names are passed as a list of strings
        excludedColumns = []
        if (len(lis) < 1):
            return response
        keys = list(lis[0].keys())
        columnsNumbers = []
        columnNames = []
        for i in range(len(keys)):
            if (keys[i] in excludedColumns):
                columnsNumbers.insert(0, i)
            else:
                columnNames.append(keys[i])

        writer.writerow(columnNames)

        for row in lis:
            values = list(row.values())
            for i in range(len(columnsNumbers)):
                values.pop(columnsNumbers[i])
            writer.writerow(values)

        return response
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})
