# URLS de la app_post:
from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from app_post import views


router = routers.DefaultRouter()
router.register(r'category', views.CategoryViewSet, 'category')
router.register(r'post', views.PostViewSet, 'post')
router.register(r'poststate', views.PostStateViewSet, 'poststate')

urlpatterns = [
    path('posts/', include(router.urls)),
    path('docs/', include_docs_urls(title='Swap It API')),
]

