from django.contrib import admin
from . import models

@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'description', 'value')
    search_fields = ('id','name', 'description', )

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'active')
    search_fields = ('id','name', )

@admin.register(models.PostState)
class PostStateAdmin(admin.ModelAdmin):
    list_display = ('id','name')
    search_fields = ('id','name', )