from django.contrib import admin
from . import models

@admin.register(models.UserAccount)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'is_staff', 'is_helper','is_exchanger')
    search_fields = ('first_name', 'last_name', 'email', 'is_staff', 'is_helper', 'is_exchanger',)