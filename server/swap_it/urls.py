from django.contrib import admin
from django.urls import path, re_path,include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.documentation import include_docs_urls
from rest_framework.decorators import permission_classes
from user.views import activation_user, ListaVista

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls.authtoken')),
    path('activate/<str:uid>/<str:token>', activation_user),
    path('list/', ListaVista.as_view()),
    path('posts/', include('app_post.urls')),
    path('subsidiary/', include('subsidiary.urls')),
    # path('api/category/', include('app_post.urls')),
    path('admin/', admin.site.urls),
    path('docs/', include_docs_urls(title='Swap It API', permission_classes=[])),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]