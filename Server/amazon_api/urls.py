from django.urls import path

from . import views

# Any hardcoded route needs to go above
urlpatterns = [
    path('get_order_by_id', views.get_order_by_id, name='get_order_by_id')
]
