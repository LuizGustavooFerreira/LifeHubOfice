from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from app.views import MeuTokenView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    
    path('api/token/', MeuTokenView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]