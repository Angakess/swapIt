

from django.urls import path

from request import views


urlpatterns = [
    # path('request/remove', views.RequestRemove.as_view(),),
    # path('request/restore', views.RequestRestore.as_view(),),
    path('create/', views.RequestCreate.as_view()),
    path('accept/', views.RequestAccept.as_view()),
    path('reject/', views.RequestReject.as_view()),
    path('list/', views.RequestList.as_view(),),
    # path('request/update/<int:pk>', views.RequestUpdate.as_view()),
    # path('request/<int:pk>/', views.RequestRetrieve.as_view()),
    # path('request/remove/<int:pk>', views.RequestRemove.as_view()),
    # path('request/list/<int:id>/', views.RequestListsExchanger.as_view(),),
    # path('requeststate/list/', views.RequestStateList.as_view()),
    # path('requeststate/create/', views.RequestStateCreate.as_view(),)
    # ------------------- VISTAS DE STATEREQUEST -------------------
    path('state/', views.RequestStateCreateList.as_view()),
]
