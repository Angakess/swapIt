from django.urls import path
from stockFilial import views

urlpatterns = [
    path("update/<int:pk>", views.UpdateStockFilial.as_view()),
    path("retrieve/<int:pk>", views.RetrieveStockFilial.as_view())
]   