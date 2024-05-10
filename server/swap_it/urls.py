from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework.documentation import include_docs_urls
urlpatterns = [
    path('', include('app_post.urls')),
    path('subsidiary/', include('subsidiary.urls')),
    path('users/', include('user.urls')),
    # path('api/category/', include('app_post.urls')),
    path('admin/', admin.site.urls),
    path('docs/', include_docs_urls(title='Swap It API',
         permission_classes=[])),
]

