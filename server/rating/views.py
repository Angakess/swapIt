from rest_framework import generics, status
from rating.models import Rating
from rating.serializer import RatingCreateSerializer, RatingSerializer,RatingNewSerializer
from rest_framework.views import APIView
from user.models import UserAccount
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingNewSerializer


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

class ModerateCommentRating(generics.UpdateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingCreateSerializer

    def partial_update(self, request, *args, **kwargs):
        comment=None
        try:
            comment = JSONParser().parse(request)[0]['comment']
        except Exception:
            print("[ERROR]", Exception)
        rating = self.get_object()
        rating.comment = comment if comment else "Este comentario a sido eliminado por un administrador."
        rating.checked = True
        rating.save()
        return Response(
            {"ok": True, "messages": ["Calificacion moderada"], "data": {"rating": RatingSerializer(rating).data}},
            status=status.HTTP_200_OK,
        )

class ListUncheckedRatings(APIView):
    def get(self, request):
        ratings = Rating.objects.filter(checked=False)
        return Response(
            {"ok": True, "messages": ["Calificaciones no moderadas"], "data": {"ratings": RatingCreateSerializer(ratings, many=True).data}},
            status=status.HTTP_200_OK,
        )


class BulkCheckRating(APIView):
    def patch(self, request):
        data = JSONParser().parse(request)[0]['ratings']
        ratings = Rating.objects.filter(id__in=data)
        for rating in ratings:
            rating.checked = True
            rating.save()
        return Response(
            {"ok": True, "messages": ["Calificaciones chequeadas"], "data": {"ratings": RatingCreateSerializer(ratings, many=True).data}},
            status=status.HTTP_200_OK,  
        )
