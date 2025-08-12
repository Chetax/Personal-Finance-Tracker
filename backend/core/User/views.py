from rest_framework import viewsets
from .models import User
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
