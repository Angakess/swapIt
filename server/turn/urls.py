from django.urls import path
from turn import views

urlpatterns = [
    # path("create/", views.TurnCreate.as_view()),
    path("my_turns/<int:id_user>", views.ListMyTurns.as_view()),
    path("list_by_post/<int:id_post>", views.ListTurnsByPostId.as_view()),
    path("list_today/", views.ListTurnsTodayView.as_view()),
    path("validate/", views.TurnsValidateView.as_view()),
    path("reject/", views.TurnsRejectView.as_view()),
    path("detail/<int:pk>/", views.DetailTurnView.as_view(), name="turn_detail"),
]
