from django.urls import path
from app_post import views


urlpatterns = [
    path('category/do/<int:id>/', views.CategoryDetails.as_view(),
         name='category-detail'),
    path('category/search/<str:name>', views.CategorySearch.as_view(),
         name='category-search'),
    path('category', views.CategoryCreate.as_view()),
    path('category/list/',
         views.CategoryList.as_view(), name='category-list'),
    path('post/do/<int:id>/', views.PostDetails.as_view(), name='post-detail'),
    path('post/', views.PostCreate.as_view(), name='post-create'),
    path('post/list/', views.PostList.as_view(), name='post-list'),
    path('posts-of-category/', views.PostOfCategory.as_view()),

]
