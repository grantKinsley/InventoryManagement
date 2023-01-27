from django.urls import path

from . import views

urlpatterns = [
    path('', views.amz_items, name='amz_items')
]
