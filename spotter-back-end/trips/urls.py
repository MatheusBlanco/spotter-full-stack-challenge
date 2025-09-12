from django.urls import path

from .views import DriverCycleView, GenerateLogSheetsView, PlanTripView

urlpatterns = [
    path('plan/', PlanTripView.as_view(), name='plan-trip'),
    path('<int:trip_id>/logs/', GenerateLogSheetsView.as_view(),
         name='generate-log-sheets'),
    path('drivers/<int:driver_id>/cycle/',
         DriverCycleView.as_view(), name='driver-cycle'),
]
