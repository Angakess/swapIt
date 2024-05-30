from django.urls import path
from . import views

urlpatterns = [
    # path('ratings/', views.RatingsListView.as_view(), name='ratings-list'),
    # path('ratings/<int:pk>/', views.RatingsDetailView.as_view(), name='ratings-detail'),
    path('ratings/create/', views.RatingCreateView.as_view(), name='ratings-create'),
    # path('ratings/update/<int:pk>/', views.RatingsUpdateView.as_view(), name='ratings-update'),
    # path('ratings/delete/<int:pk>/', views.RatingsDeleteView.as_view(), name='ratings-delete'),
]
