from django.contrib import admin
from . import models

@admin.register(models.UserAccount)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'dni', 'first_name', 'last_name', 'email', 'state', 'role',)
    search_fields = ('id', 'dni', 'first_name', 'last_name', 'email', 'state__name', 'role',)

@admin.register(models.UserRegister)
class UserRegisterAdmin(admin.ModelAdmin):
    list_display = ('user', 'code',)
    search_fields = ('user__name', 'code',)

@admin.register(models.UserForgotPassword)
class UserForgotAdmin(admin.ModelAdmin):
    list_display = ('user', 'code',)
    search_fields = ('user__name', 'code',)