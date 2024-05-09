from rest_framework import permissions


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class IsExchanger(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_exchanger


class IsHelper(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_helper


class ValidateAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            (request.META.get('HTTP_REFERER') == 'http://localhost:8000/docs/'
             and request.META.get('SERVER_PORT') == '8000') or
            permissions.IsAuthenticated().has_permission(request, view)
        )
