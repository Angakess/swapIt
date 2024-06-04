from django.urls import path
from . import views

urlpatterns = [
    # path('ratings/', views.RatingsListView.as_view(), name='ratings-list'),
    # path('ratings/<int:pk>/', views.RatingsDetailView.as_view(), name='ratings-detail'),
    path('create/', views.RatingCreateView.as_view(), name='ratings-create'),
    path('user/<int:user_id>/', views.RatingOfUser.as_view(), name='ratings-user'),
    # path('ratings/update/<int:pk>/', views.RatingsUpdateView.as_view(), name='ratings-update'),
    # path('ratings/delete/<int:pk>/', views.RatingsDeleteView.as_view(), name='ratings-delete'),
]
