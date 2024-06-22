from django.urls import path
from request import views


urlpatterns = [
    path("create/", views.RequestCreate.as_view()),
    path("accept/", views.RequestAccept.as_view()),
    path("reject/", views.RequestReject.as_view()),
    path("confirm/", views.RequestConfirm.as_view()),
    path("list/", views.RequestList.as_view()),
    path("list/<int:request_id>/", views.RequestDetailById.as_view()),
    path("my_offerts/<int:user_id>", views.RequestListMaker.as_view()),
    path("my_requests/<int:user_id>", views.RequestListReceive.as_view()),
    path("cancel_request/", views.RequestMakedCancel.as_view()),
    path("state/", views.RequestStateCreateList.as_view())
]
