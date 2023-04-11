from django.http import JsonResponse
from sp_api.api import Orders
from sp_api.base import Marketplaces


# Credentials dict for testing, later need to grab credentials from MongoDB associated with user 
credentials = dict(
    refresh_token='your_refresh_token',
    lwa_app_id='your_lwa_app_id',
    lwa_client_secret='your_lwa_client_secret',
    aws_access_key='your_aws_access_key',
    aws_secret_key='your_aws_secret_key'
)

# Send a request to the Amazon API endpoint, and return the response 
def get_order_by_id(token, orderId):
    try:
        order_client = Orders(credentials=credentials, marketplace=Marketplaces.US)
        order = order_client.get_order(orderId)
        return JsonResponse(order.payload, safe=False)
    except:
        return JsonResponse({"Error": "Request has returned an exception"})
    

