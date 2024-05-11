from django.contrib import admin
from .models import Subsidiary

@admin.register(Subsidiary)
class SubsidiaryAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'x_coordinate', 'y_coordinate', 'max_helpers', 'active')
    search_fields = ('id','name',)