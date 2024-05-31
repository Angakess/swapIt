from django.contrib import admin

# Register your models here.
from .models import Request, RequestState
admin.site.register(Request)
admin.site.register(RequestState)
