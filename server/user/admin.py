from django.contrib import admin
from . import models

@admin.register(models.UserAccount)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id','first_name', 'last_name', 'email', 'is_staff', 'is_helper','is_exchanger')
    search_fields = ('id','first_name', 'last_name', 'email', 'is_staff', 'is_helper', 'is_exchanger',)

@admin.register(models.UserRegister)
class UserRegisterAdmin(admin.ModelAdmin):
    list_display = ('user', 'code',)
    search_fields = ('user', 'code',)