from django.contrib import admin
from .models import Request, RequestState

admin.site.register(Request)
admin.site.register(RequestState)
