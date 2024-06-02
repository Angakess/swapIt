from django.urls import path
from turn import views

urlpatterns = [
    # path("create/", views.TurnCreate.as_view()),
    path("my_turns/<int:id_user>", views.ListMyTurns.as_view()),
    path("list_today/", views.ListTurnsTodayView.as_view()),
    path("validate/", views.TurnsValidateView.as_view()),
    path("reject/", views.TurnsRejectView.as_view()),
]
