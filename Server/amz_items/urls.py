from django.urls import path

from . import views

urlpatterns = [
    path('', views.amz_items, name='amz_items'),
    path('<str:asin>', views.amz_item, name='amz_item'),
    path('<str:asin>/report/', views.write_report, name='write_report')
]
