from django.db import models


# Create your models here.
class Driver(models.Model):
    name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    current_cycle_hours = models.IntegerField()

    def __str__(self):
        return self.name


class HOSLog(models.Model):
    driver = models.ForeignKey(
        Driver, related_name='hos_logs', on_delete=models.CASCADE)
    date = models.DateField()
    duty_status = models.CharField(max_length=50)
    start_time = models.DateTimeField()
    duration = models.IntegerField()  # in minutes

    def __str__(self):
        return f"HOS Log for {self.driver.name} on {self.date}"
