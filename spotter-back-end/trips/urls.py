from django.urls import path

from .views import DriverCycleView, PlanTripView

urlpatterns = [
    path('plan/', PlanTripView.as_view(), name='plan-trip'),
    path('drivers/<int:driver_id>/cycle/',
         DriverCycleView.as_view(), name='driver-cycle'),
]
