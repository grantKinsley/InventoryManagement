from sp_api.api import Orders


credentials = dict(
    refresh_token='your_refresh_token',
    lwa_app_id='your_lwa_app_id',
    lwa_client_secret='your_lwa_client_secret',
    aws_access_key='your_aws_access_key',
    aws_secret_key='your_aws_secret_key'
)

order_client = Orders(credentials=credentials, marketplace=Marketplaces.US)
order = order_client.get_order('your-order-id')
print(order) # `order` is an `ApiResponse`
print(order.payload) # `payload` contains the original response
