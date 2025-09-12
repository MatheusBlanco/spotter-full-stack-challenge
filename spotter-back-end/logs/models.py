from django.db import models

from eld.models import Driver
from trips.models import Trip


class LogSheet(models.Model):
    driver = models.ForeignKey(
        Driver, on_delete=models.CASCADE, related_name='logsheets')
    date = models.DateField()
    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name='logsheets')
    file = models.FileField(upload_to='logsheets/',
                            null=True, blank=True)  # For storing PDF/image
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optionally, store summary data for quick access
    total_driving_hours = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    total_on_duty_hours = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    total_off_duty_hours = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)
    total_sleeper_berth_hours = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.driver.name} - {self.date}"
