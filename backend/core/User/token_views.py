from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .token_serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        tokens = serializer.validated_data
        return Response({
            "user_id": user.id,
            "access": tokens["access"],
            "refresh": tokens["refresh"]
        })
