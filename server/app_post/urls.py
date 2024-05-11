from django.urls import path
from app_post import views


urlpatterns = [
    path('category/remove', views.CategoryRemove.as_view(),
         name='category-remove'),
    path('category/restore', views.CategoryRestore.as_view(),
         name='category-restore'),
    path('category/search/<str:name>', views.CategorySearch.as_view(),
         name='category-search'),
    path('category/create', views.CategoryCreate.as_view()),
    path('category/list/<str:state>', views.CategoryList.as_view(),
         name='category-list'),
    path('post/do/<int:id>/', views.PostDetails.as_view(), name='post-detail'),
    path('post/', views.PostCreate.as_view(), name='post-create'),
    path('post/list/', views.PostList.as_view(), name='post-list'),

]
