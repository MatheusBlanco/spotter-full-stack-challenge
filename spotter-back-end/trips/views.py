
from django.shortcuts import get_object_or_404
from eld.models import Driver
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .planner import plan_trip
from .serializers import DriverSerializer, TripSerializer


class PlanTripView(APIView):
    def post(self, request):
        trip_data = request.data.get('trip')
        driver_data = request.data.get('driver')
        if not trip_data or not driver_data:
            return Response({'detail': 'Both trip and driver data are required.'}, status=status.HTTP_400_BAD_REQUEST)

        trip_serializer = TripSerializer(data=trip_data)
        driver_serializer = DriverSerializer(data=driver_data)

        if not trip_serializer.is_valid():
            return Response({'trip_errors': trip_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        if not driver_serializer.is_valid():
            return Response({'driver_errors': driver_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        trip = trip_serializer.save()
        driver = driver_serializer.save()

        try:
            result = plan_trip(driver, trip)
        except Exception as e:
            return Response({'detail': f'Error during trip planning: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if 'errors' in result:
            return Response({'detail': 'Trip planning failed.', 'errors': result['errors']}, status=status.HTTP_400_BAD_REQUEST)

        plans = result.get('plans', [])
        planning_errors = [p.get('errors') for p in plans if p.get('errors')]
        if planning_errors:
            return Response({'detail': 'HOS or planning errors found.', 'planning_errors': planning_errors, 'result': result}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK)


class DriverCycleView(APIView):
    def get(self, request, driver_id):
        driver = get_object_or_404(Driver, pk=driver_id)
        used = driver.current_cycle_hours
        remaining = max(0, 70 * 60 - used)
        return Response({'driver_id': driver.id, 'used_minutes': used, 'remaining_minutes': remaining})
