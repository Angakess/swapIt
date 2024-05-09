
from rest_framework.response import Response

from app_post.models import Category
from app_post.serializer import CategorySerializer


class CategorySearchMixin:
    """
    Mixin to add search functionality to a view.
    """

    def get_object(self):
        try:
            search = self.kwargs.get('name')
            queryset = Category.objects.filter(name__icontains=search)
            print("[QUERYSET]", queryset.values())
            serializer = CategorySerializer(data=queryset.values(), many=True)
            print("[QUERYSET][AFTER]", queryset.values())

            return Response(serializer.initial_data)
        except Exception as e:
            print(e)
            return Response({"Error": "Not values found"})
