from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'trips', views.TripViewSet, basename='trip')
router.register(r'stops', views.StopViewSet, basename='stop')
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'cities', views.CityViewSet, basename='city')
router.register(r'activitymeta', views.ActivityMetaViewSet, basename='activitymeta')
router.register(r'public', views.PublicItineraryViewSet, basename='public')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'),
    path('auth/login/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
    path('health/', views.HealthCheckView.as_view(), name='health'),
]
