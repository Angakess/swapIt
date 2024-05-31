from django.urls import path
from app_post import views


urlpatterns = [
    # ------------------- VISTAS DE CATEGORIA -------------------
    path('category/remove', views.CategoryRemove.as_view(),),
    path('category/restore', views.CategoryRestore.as_view(),),
    path('category/create', views.CategoryCreate.as_view()),
    path('category/list/', views.CategoryList.as_view(),),
    path('category/update/<int:pk>', views.CategoryUpdate.as_view()),
    # ------------------- VISTAS DE POST -------------------
    path('post/<int:pk>/', views.PostRetrieve.as_view()),
    path('post/update/<int:pk>/', views.PostUpdate.as_view()),
    path('post/', views.PostCreate.as_view()),
    path('post/remove/<int:pk>', views.PostRemove.as_view()),

    path('post/list/', views.PostLists.as_view(),),
    path('post/list/<int:id>/', views.PostListsExchanger.as_view()),
    path('post/moderate/', views.PostModeration.as_view()),
    # ------------------- VISTAS DE POST STATE -------------------
    path('poststate/list/', views.PostStateList.as_view()),
    path('poststate/create/', views.PostStateCreate.as_view())
]
