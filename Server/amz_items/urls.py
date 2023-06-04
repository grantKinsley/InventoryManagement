from django.urls import path

from . import views

# Any hardcoded route needs to go above
urlpatterns = [
    path('', views.amz_items, name='amz_items'),
    path('asins', views.get_all_asins, name='get_asins'),
    path('report', views.write_report, name='write_report'),
    path('reportSales', views.write_report_sales, name='write_report_sales'),
    path('template', views.write_template, name='write_template'),
    path('hist', views.general_history, name='general_history'),
    path('hist/<str:asin>', views.price_history, name='history'),
    path('delete', views.delete_one, name='delete'),
    path('<str:asin>', views.amz_item, name='amz_item'),
]
