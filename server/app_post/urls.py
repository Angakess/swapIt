# URLS de la app_post:
from django.urls import path, include
from rest_framework import routers
from app_post import views


router = routers.DefaultRouter()
# router.register(r'category', views.CategoryViewSet, 'category')
router.register(r'post', views.PostViewSet, 'post')
router.register(r'poststate', views.PostStateViewSet, 'poststate')

urlpatterns = [
    path('', include(router.urls)),
    path('category/<int:pk>/',
         views.CategoryDetails.as_view(),
         name='category-detail'),
    path('category/',
         views.CategoryCreate.as_view(),
         name='category-create'),
    path('categorys/',
         views.CategoryList.as_view(),
         name='category-list'),

         
]

