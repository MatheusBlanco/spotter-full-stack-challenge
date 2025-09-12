from django.db import models


# Create your models here.
class Trip(models.Model):
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    pickup_location = models.CharField(max_length=100)
    estimated_duration = models.IntegerField()
    # Optional geocoded coordinates (WGS84)
    origin_lat = models.FloatField(null=True, blank=True)
    origin_long = models.FloatField(null=True, blank=True)
    pickup_lat = models.FloatField(null=True, blank=True)
    pickup_long = models.FloatField(null=True, blank=True)
    dropoff_lat = models.FloatField(null=True, blank=True)
    dropoff_long = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.origin} to {self.destination} ({self.estimated_duration} mins)"


class RouteSegment(models.Model):
    start_point = models.CharField(max_length=100)
    end_point = models.CharField(max_length=100)
    distance = models.FloatField()
    trip = models.ForeignKey(
        Trip, related_name='route_segments', on_delete=models.CASCADE)
    driving_time = models.IntegerField()

    def __str__(self):
        return f"{self.start_point} to {self.end_point} ({self.distance} km, {self.driving_time} mins)"


class FuelStop(models.Model):
    location = models.CharField(max_length=100)
    fuel_amount = models.FloatField()  # in liters
    trip = models.ForeignKey(
        Trip, related_name='fuel_stops', on_delete=models.CASCADE)

    def __str__(self):
        return f"Fuel Stop at {self.location} ({self.fuel_amount} L)"


class RestStop(models.Model):
    location = models.CharField(max_length=100)
    duration = models.IntegerField()  # in minutes
    reason = models.CharField(max_length=255, blank=True, null=True)
    trip = models.ForeignKey(
        Trip, related_name='rest_stops', on_delete=models.CASCADE)

    def __str__(self):
        return f"Rest Stop at {self.location} ({self.duration} mins)"
