# URLS de la app_post:
from django.urls import path
from app_post import views
from .views import SubsidiaryDetails, SubsidiaryCreate, SubsidiaryList

urlpatterns = [
    path('subsidiary/<int:pk>/',
         SubsidiaryDetails.as_view(),
         name='subsidiary-detail'),
    path('subsidiary/',
         SubsidiaryCreate.as_view(),
         name='subsidiary-create'),
    path('subsidiaries/',
         SubsidiaryList.as_view(),
         name='subsidiary-list'),      
]