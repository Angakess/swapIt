from django.urls import path
from .views import (CreateUser, ActivateUser, LoginUser, ForgotPassword, ResetPassword,
                    SearchHelper, SearchExchanger, DisincorporateHelper, RetrieveHelper, RetrieveExchanger, ChangeHelperFilial, UserScore, RemoveUser,
                    PutInReviewUser,UpdateUser, RetrieveUser, RemoveUserFromReview, ConvertToHelper, RetrieveExchangerDNI
                    )


urlpatterns = [
    # -------------ACTIONS----------------
    path('disincorporate-helper/<int:id>', DisincorporateHelper.as_view(),
         name='user-disincorporate-helper'),
    path('create/', CreateUser.as_view(), name='user-create'),
    path('activate/', ActivateUser.as_view(), name='user-activate'),
    path('login/', LoginUser.as_view(), name='user-login'),
    path('forgot-password/', ForgotPassword.as_view(),
         name='user-forgot-password'),
    path('reset-password/', ResetPassword.as_view(), name='user-reset-password'),
    path('change-filial/<int:helper_id>/<int:filial_id>',
         ChangeHelperFilial.as_view(), name='user-change-filial'),
    path('put-in-review/<int:user_id>',
         PutInReviewUser.as_view(), name='user-put-in-review'),
     path('remove-user-from-review/<int:user_id>', RemoveUserFromReview.as_view(),
          name='user-remove-from-review'),
    # -------------LISTS----------------
    path('list-helpers/', SearchHelper.as_view(), name='user-list-helpers'),
    path('list-exchangers/', SearchExchanger.as_view(),
         name='user-list-exchangers'),
    # -------------RETRIEVE----------------
    path('get-helper/<int:pk>', RetrieveHelper.as_view(), name='user-get-helper'),
    path('get-exchanger/<int:pk>', RetrieveExchanger.as_view(),
         name='user-get-exchanger'),
    path('get-exchanger-dni/<int:dni>', RetrieveExchangerDNI.as_view()),
    path('score/<int:user_id>', UserScore.as_view(), name='user-score'),

    path('update-profile/<int:pk>', UpdateUser.as_view()),
    path('remove-exchanger/<int:user_id>',
         RemoveUser.as_view(), name='user-remove-exchanger'),
    path('get/<int:pk>', RetrieveUser.as_view(), name='user-retrieve'),
    path('convert-to-helper/<int:helper_id>/<int:filial_id>', ConvertToHelper.as_view(), name='user-convert-to-helper')
]
