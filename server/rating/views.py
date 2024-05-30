from rest_framework import generics
from rating.models import Rating
from rating.serializer import RatingSerializer


class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
