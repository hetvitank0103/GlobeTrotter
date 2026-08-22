from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    UserProfile, City, ActivityCategory, ActivityMeta,
    Trip, Stop, Activity, PublicItinerary
)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)  # default empty profile
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('preferences',)

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile')

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class ActivityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityCategory
        fields = '__all__'

class ActivityMetaSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=ActivityCategory.objects.all(), allow_null=True)
    class Meta:
        model = ActivityMeta
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'title', 'description', 'cost', 'duration_minutes')

class StopSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    class Meta:
        model = Stop
        fields = ('id', 'city', 'order', 'arrival_date', 'activities')

class TripSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)
    class Meta:
        model = Trip
        fields = ('id', 'name', 'start_date', 'end_date', 'description', 'cover_photo', 'stops')

class PublicItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicItinerary
        fields = ('uuid', 'trip', 'is_public')

class BudgetSerializer(serializers.Serializer):
    total_transport = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_stay = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_activities = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_meals = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_cost = serializers.DecimalField(max_digits=12, decimal_places=2)
    avg_per_day = serializers.DecimalField(max_digits=12, decimal_places=2)
