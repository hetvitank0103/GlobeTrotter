from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    preferences = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    cost_index = models.FloatField(default=0.0)
    popularity_score = models.FloatField(default=0.0)
    image = models.ImageField(upload_to='city_images/', blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.country}"

class ActivityCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class ActivityMeta(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='activities')
    category = models.ForeignKey(ActivityCategory, on_delete=models.SET_NULL, null=True, related_name='activities')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} ({self.city.name})"

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    name = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    cover_photo = models.ImageField(upload_to='trip_covers/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()
    arrival_date = models.DateField()

    class Meta:
        ordering = ['order']
        unique_together = ('trip', 'order')

    def __str__(self):
        return f"Stop {self.order} in {self.city.name} for {self.trip.name}"

class Activity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    duration_minutes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} on {self.stop.city.name}"

class PublicItinerary(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='public_links')
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return f"Public link for {self.trip.name}"
