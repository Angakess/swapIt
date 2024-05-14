from django.urls import path
from .views import (CreateUser, ActivateUser, LoginUser, ForgotPassword, ResetPassword, 
                    SearchHelper, SearchExchanger, DisincorporateHelper, RetrieveHelper, RetrieveExchanger, ChangeHelperFilial
)


urlpatterns = [
    path('create/', CreateUser.as_view(), name='user-create'),
    path('activate/', ActivateUser.as_view(), name='user-activate'),
    path('login/', LoginUser.as_view(), name='user-login'),
    path('forgot-password/', ForgotPassword.as_view(), name='user-forgot-password'),
    path('reset-password/', ResetPassword.as_view(), name='user-reset-password'),
    path('list-helpers/', SearchHelper.as_view(), name='user-list-helpers'),
    path('list-exchangers/', SearchExchanger.as_view(), name='user-list-exchangers'),
    path('disincorporate-helper/<int:id>', DisincorporateHelper.as_view(), name='user-disincorporate-helper'),
    path('get-helper/<int:pk>', RetrieveHelper.as_view(), name='user-get-helper'),
    path('get-exchanger/<int:pk>', RetrieveExchanger.as_view(), name='user-get-exchanger'),
    path('change-filial/<int:helper_id>/<int:filial_id>', ChangeHelperFilial.as_view(), name='user-change-filial')
]
