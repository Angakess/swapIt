from django.urls import path
from .views import CreateUser, ActivateUser, LoginUser, ForgotPassword, ResetPassword, SearchHelper, SearchExchanger, DisincorporateHelper


urlpatterns = [
    path('create/', CreateUser.as_view(), name='user-create'),
    path('activate/', ActivateUser.as_view(), name='user-activate'),
    path('login/', LoginUser.as_view(), name='user-login'),
    path('forgot-password/', ForgotPassword.as_view(), name='user-forgot-password'),
    path('reset-password/', ResetPassword.as_view(), name='user-reset-password'),
    path('list-helpers/', SearchHelper.as_view(), name='user-list-helpers'),
    path('list-exchangers/', SearchExchanger.as_view(), name='user-list-exchangers'),
    path('disincorporate-helper/<int:id>', DisincorporateHelper.as_view(), name='user-disincorporate-helper'),
]
