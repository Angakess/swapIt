from django.urls import path
from .views import CreateUser, ActivateUser, LoginUser, ForgotPassword, ResetPassword


urlpatterns = [
    path('create/', CreateUser.as_view(), name='user-create'),
    path('activate/', ActivateUser.as_view(), name='user-activate'),
    path('login/', LoginUser.as_view(), name='user-login'),
    path('forgot-password/', ForgotPassword.as_view(), name='user-forgot-password'),
    path('reset-password/', ResetPassword.as_view(), name='user-reset-password'),
]
