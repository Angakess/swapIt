from django.urls import path
from .views import CreateUser, ActivateUser, LoginUser


urlpatterns = [
    path('create/', CreateUser.as_view(), name='user-create'),
    path('activate/', ActivateUser.as_view(), name='user-activate'),
    path('login/', LoginUser.as_view(), name='user-login')
]
