from django.urls import path

from . import views

# Any hardcoded route needs to go above
urlpatterns = [
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
]
