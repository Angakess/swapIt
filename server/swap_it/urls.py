from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from django.conf.urls.static import static
from .settings import MEDIA_ROOT, MEDIA_URL

urlpatterns = [
    path("", include("app_post.urls")),
    path("subsidiary/", include("subsidiary.urls")),
    path("stock/", include("stockFilial.urls")),
    path("users/", include("user.urls")),
    path("requests/", include("request.urls")),
    path("turns/", include("turn.urls")),
    path("ratings/", include("rating.urls")),
    path("admin/", admin.site.urls),
    path("docs/", include_docs_urls(title="Swap It API", permission_classes=[])),
]

urlpatterns += static(MEDIA_URL, document_root=MEDIA_ROOT)
