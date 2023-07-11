from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('room/', views.room, name='room'),
    path('token/', views.generateToken, name='token'),
    path('create_user/', views.createUser, name='create_user'),
    path('get_user/', views.getUser, name='get_user'),
    path('delete_User/', views.deleteUser, name='delete_User')
]