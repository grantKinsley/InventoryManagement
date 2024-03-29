from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, HttpResponse
import logging
from . import controllers
from . import middleware
import json
import csv as CSV

logger = logging.getLogger(__name__)
# Create your views here.
# Route: /amz_items/
@csrf_exempt
@middleware.authentication_required
def amz_items(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    logger.info("IP: " + ip + " accessed amz_items ")
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
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    logger.info(ip)
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
def write_template(request):
    try:
        if request.method == 'GET':
            token = request.META.get("decoded_token")
            lis = controllers.get_list_search(token)
            #lis = controllers.get_list()
            excludedColumns = request.GET.getlist("exclude[]")
            return downloadCSV(lis,excludedColumns,True)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"})
@csrf_exempt
@middleware.authentication_required
def write_report(request):
    try:
        if request.method == 'GET':
            token = request.META.get("decoded_token")
            lis = controllers.get_list_search(token)
            #lis = controllers.get_list()
            excludedColumns = request.GET.getlist("exclude[]")
            return downloadCSV(lis,excludedColumns,False)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"})

@csrf_exempt
@middleware.authentication_required
def write_report_sales(request):
    try:
        if request.method == 'GET':
            token = request.META.get("decoded_token")
            lis = controllers.get_list_search(token)
            #lis = controllers.get_list()
            #excludedColumns = ["Manufacturer Code", "Prep Instructions Vendor State","Replenishment Category","ISBN-13", "Prep Instructions Required","Product Group","Release Date","Replenishment Category"
            #                    "UPC", ]
            excludedColumns = request.GET.getlist("exclude[]")
            print(excludedColumns)
            return downloadCSV(lis,excludedColumns,False)
    except Exception as err:
        print(err)
        return JsonResponse({"Error 404": f"{err}"})


def downloadCSV(lis,excludedColumns,template):
    try:
        response = HttpResponse(
            content_type='text/csv',
            headers={
                'Content-Disposition': 'attachment; filename="somefilename.csv"'},
        )
        writer = CSV.writer(response)

        # For exlcuding columns assuming the column names are passed as a list of strings
        
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

        #change template to true if you do not want the data
        if(template):
            return response

        for row in lis:
            items = list(row.items())
            items = list(filter(lambda x: x[0] not in excludedColumns, items))
            values = [x[1] for x in items]
            writer.writerow(values)

        return response
    except Exception as err:
        return JsonResponse({"Error 404": f"{err}"})

@csrf_exempt
@middleware.authentication_required
def general_history(request):
    token = request.META.get("decoded_token")
    start = request.META.get("HTTP_START")
    end = request.META.get("HTTP_END")
    return controllers.get_general_history(start,end,token)

@csrf_exempt
@middleware.authentication_required
def price_history(request,asin):
    token = request.META.get("decoded_token")
    return controllers.getTimeSeries(asin,token)

@csrf_exempt
@middleware.authentication_required
def delete_one(request,asin):
    token = request.META.get("decoded_token")
    return controllers.delete_item(asin, token)

@csrf_exempt
@middleware.authentication_required
def get_all_asins(request):
    token = request.META.get("decoded_token")
    return controllers.get_asins(token)