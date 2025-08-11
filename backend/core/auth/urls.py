# auth/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, ProtectedView
from User.token_views import CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
