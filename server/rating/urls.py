from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.RatingCreateView.as_view(), name='ratings-create'),
    path('user/<int:user_id>/', views.RatingOfUser.as_view(), name='ratings-user'),
    path('moderate/<int:pk>/', views.ModerateCommentRating.as_view(), name='ratings-update'),
    path('list/unchecked/', views.ListUncheckedRatings.as_view()),
    path('check/', views.BulkCheckRating.as_view()),
]
