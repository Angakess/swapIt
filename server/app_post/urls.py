from django.urls import path
from app_post import views


urlpatterns = [
    path('category/remove', views.CategoryRemove.as_view(),
         name='category-remove'),
    path('category/restore', views.CategoryRestore.as_view(),
         name='category-restore'),
    path('category/create', views.CategoryCreate.as_view()),
    path('category/list/', views.CategoryList.as_view(),
         name='category-list'),
    path('category/update/<int:pk>', views.CategoryUpdate.as_view(),
         name='category-update'),

    path('post/<int:id>/', views.PostDetails.as_view(), name='post-detail'),
    path('post/', views.PostCreate.as_view(), name='post-create'),
    path('post/remove/<int:pk>', views.PostRemove.as_view(), name='post-remove'),

    path('post/list/',
         views.PostLists.as_view(),
         name='post-lists'),
    path('post/list/<int:id>/',
         views.PostListsExchanger.as_view(),
         name='post-lists-exchanger'),



    #     re_path(r'^post/list/(?P<query>\d)(&)?{0,3}',
    #             views.PostLists.as_view(),
    #             name='post-lists-state'),
]
