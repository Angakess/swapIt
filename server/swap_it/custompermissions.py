from rest_framework import permissions
from user.models import Role

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == Role.ADMIN


class IsHelper(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == Role.HELPER

class IsExchanger(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.role == Role.EXCHANGER