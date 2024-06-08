from rest_framework import generics, status
from rating.models import Rating
from rating.serializer import RatingCreateSerializer, RatingSerializer
from rest_framework.views import APIView
from user.models import UserAccount
from rest_framework.response import Response

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingCreateSerializer


class RatingOfUser(APIView):
    def get(self, request, user_id):
        user = UserAccount.objects.filter(id=user_id).first()
        if user is None:
            return Response(
                {"ok": False, "messages": ["Usuario no encontrado"], "data":{}},
                status=status.HTTP_404_NOT_FOUND,
            )
        rating = user.ratings_received.all()

        return Response(
            {"ok": True, "messages": ["Califiaciones del usuario"], "data": {"ratings": RatingSerializer(rating, many=True).data}},
            status=status.HTTP_200_OK,
        )