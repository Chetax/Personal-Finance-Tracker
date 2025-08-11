# from rest_framework.decorators import api_view
# from django.contrib.auth.models import User
# from rest_framework.response import Response
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework import status
# from User.models import User
# from User.serializers import UserSerializer
# @api_view(["POST"])
# def register_user(request):
#     email = request.data.get('email')

#     password = request.data.get('password')
#     name = request.data.get('name', '') 
#     if not email or not password:
#         return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

#     if User.objects.filter(email=email).exists():
#         return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

#     user = User(
#         name=name,
#         email=email,
#     )
#     user.set_password(password)  
#     user.save()

#     serializer = UserSerializer(user)
#     return Response(serializer.data, status=status.HTTP_201_CREATED)


# @api_view(["POST"])
# def login_user(request):
#     email=request.data.get('email')
#     password=request.data.get('password')
#     if not email or not password:
#         return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         user=User.objects.get(email=email)
#     except User.DoesNotExist:
#         return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#     if user.check_password(password):
#         return Response({"message": "Login successful", "user_id": user.id}, status=status.HTTP_200_OK)
#     else :
#          return Response({"message":"Invalid Creadentials"},status=status.HTTP_401_UNAUTHORIZED)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from User.models import User
from User.serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import authenticate

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "tokens": tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "tokens": tokens
        }, status=status.HTTP_200_OK)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": f"Hello {request.user.name}, you are authenticated!"})
