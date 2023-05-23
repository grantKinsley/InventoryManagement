from django.urls import path

from . import views

# Any hardcoded route needs to go above
urlpatterns = [
    path('', views.amz_items, name='amz_items'),
    path('asins', views.get_all_asins, name='get_asins'),
    path('report', views.write_report, name='write_report'),
    path('report/<str:asin>', views.write_report_search, name='write_report_search'),
    path('<str:asin>', views.amz_item, name='amz_item'),
    path('hist/<str:asin>', views.price_history, name='history'),
    path('delete', views.delete_one, name='delete'),
    
]
