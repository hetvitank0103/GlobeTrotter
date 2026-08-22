from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import (
    UserProfile, City, ActivityCategory, ActivityMeta,
    Trip, Stop, Activity, PublicItinerary
)
from .serializers import (
    RegisterSerializer, UserSerializer, UserProfileSerializer,
    CitySerializer, ActivityCategorySerializer, ActivityMetaSerializer,
    TripSerializer, StopSerializer, ActivitySerializer,
    PublicItinerarySerializer, BudgetSerializer
)

class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"message": "GlobeTrotter backend is running"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    @action(detail=True, methods=['get'])
    def budget(self, request, pk=None):
        trip = self.get_object()
        total_transport = 0  # placeholder; real logic can sum transport costs
        total_stay = 0
        total_activities = sum(act.cost for act in Activity.objects.filter(stop__trip=trip))
        total_meals = 0
        total_cost = total_transport + total_stay + total_activities + total_meals
        days = (trip.end_date - trip.start_date).days + 1
        avg_per_day = total_cost / days if days else total_cost
        budget_data = {
            "total_transport": total_transport,
            "total_stay": total_stay,
            "total_activities": total_activities,
            "total_meals": total_meals,
            "total_cost": total_cost,
            "avg_per_day": avg_per_day,
        }
        serializer = BudgetSerializer(budget_data)
        return Response(serializer.data)

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Stop.objects.filter(trip__user=self.request.user)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(stop__trip__user=self.request.user)

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['country', 'name']

class ActivityMetaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityMeta.objects.all()
    serializer_class = ActivityMetaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['city', 'category']

class PublicItineraryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PublicItinerary.objects.filter(is_public=True)
    serializer_class = PublicItinerarySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'uuid'
    lookup_url_kwarg = 'uuid'

    def get_object(self):
        uuid = self.kwargs.get(self.lookup_url_kwarg)
        return get_object_or_404(PublicItinerary, uuid=uuid, is_public=True)
