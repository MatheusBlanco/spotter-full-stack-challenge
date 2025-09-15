import logging
from datetime import datetime, timedelta

from geopy.exc import GeocoderServiceError, GeocoderTimedOut
from geopy.geocoders import Nominatim

from trips.routes import get_route

logger = logging.getLogger(__name__)


def geocode_address(address):
    if not address:
        return None, None

    try:
        geolocator = Nominatim(user_agent="spotter-eld-app")
        location = geolocator.geocode(address, timeout=10)
        if location:
            return location.latitude, location.longitude
        return None, None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.warning(f"Geocoding failed for '{address}': {e}")
        return None, None


def get_coordinates(trip):
    if trip.origin_lat and trip.origin_long:
        origin_coords = (trip.origin_long, trip.origin_lat)
    else:
        lat, lng = geocode_address(trip.origin)
        if lat and lng:
            origin_coords = (lng, lat)
        else:
            raise ValueError(
                f"Could not determine coordinates for origin: {trip.origin}")

    if trip.pickup_lat and trip.pickup_long:
        pickup_coords = (trip.pickup_long, trip.pickup_lat)
    else:
        lat, lng = geocode_address(trip.pickup_location)
        if lat and lng:
            pickup_coords = (lng, lat)
        else:
            raise ValueError(
                f"Could not determine coordinates for pickup: {trip.pickup_location}")

    if trip.dropoff_lat and trip.dropoff_long:
        dropoff_coords = (trip.dropoff_long, trip.dropoff_lat)
    else:
        lat, lng = geocode_address(trip.destination)
        if lat and lng:
            dropoff_coords = (lng, lat)
        else:
            raise ValueError(
                f"Could not determine coordinates for destination: {trip.destination}")

    return [origin_coords, pickup_coords, dropoff_coords]


def calculate_fuel_stops(total_distance_miles, route_coordinates):
    """Calculate fuel stops every 1000 miles along the route."""
    fuel_stops = []
    if total_distance_miles > 1000:
        num_stops = int(total_distance_miles // 1000)
        for i in range(1, num_stops + 1):
            stop_distance = i * 1000
            fuel_stops.append({
                'distance_from_start': stop_distance,
                'location': f"Fuel Stop {i} (approx {stop_distance} miles)",
                'fuel_amount': 200  # gallons, typical truck tank
            })
    return fuel_stops


def plan_trip(driver, trip):
    """Enhanced trip planner with geocoding and improved HOS logic."""
    try:
        coordinates = get_coordinates(trip)
        route = get_route(coordinates)

        if not route or 'features' not in route or not route['features']:
            raise ValueError(
                "Unable to calculate route - no routing data returned")

        segments = route['features'][0]['properties']['segments']
        total_distance_meters = sum(seg['distance'] for seg in segments)
        total_distance_miles = total_distance_meters / 1609.34
        total_duration_seconds = sum(seg['duration'] for seg in segments)
        total_driving_hours = total_duration_seconds / 3600

        fuel_stops = calculate_fuel_stops(total_distance_miles, coordinates)

        plans = []
        current_date = datetime.now().date()
        driving_today = timedelta()
        on_duty_today = timedelta(hours=1)  # 1 hour for pickup

        remaining_driving_time = timedelta(hours=total_driving_hours)

        while remaining_driving_time > timedelta(0):
            max_driving_today = timedelta(hours=11) - driving_today
            max_on_duty_today = timedelta(hours=14) - on_duty_today

            available_time = min(max_driving_today, max_on_duty_today)

            if available_time <= timedelta(0):
                plans.append({
                    'date': current_date.isoformat(),
                    'driving_hours': driving_today.total_seconds() / 3600,
                    'on_duty_hours': on_duty_today.total_seconds() / 3600,
                    'off_duty_hours': 10,
                    'status': 'completed'
                })
                current_date += timedelta(days=1)
                driving_today = timedelta()
                on_duty_today = timedelta()
                continue

            time_to_drive = min(remaining_driving_time, available_time)
            driving_today += time_to_drive
            on_duty_today += time_to_drive
            remaining_driving_time -= time_to_drive

        on_duty_today += timedelta(hours=1)

        plans.append({
            'date': current_date.isoformat(),
            'driving_hours': driving_today.total_seconds() / 3600,
            'on_duty_hours': on_duty_today.total_seconds() / 3600,
            'off_duty_hours': 24 - (on_duty_today.total_seconds() / 3600),
            'status': 'completed'
        })

        for plan in plans:
            errors = []
            if plan['driving_hours'] > 11:
                errors.append("Exceeded 11-hour driving limit")
            if plan['on_duty_hours'] > 14:
                errors.append("Exceeded 14-hour on-duty limit")
            if errors:
                plan['errors'] = errors

        trip_summary = {
            'total_distance_miles': round(total_distance_miles, 1),
            'total_driving_hours': round(total_driving_hours, 1),
            'estimated_days': len(plans),
            'fuel_stops': fuel_stops,
            'coordinates': coordinates
        }

        return {
            'plans': plans,
            'summary': trip_summary,
            'fuel_stops': fuel_stops
        }

    except Exception as e:
        logger.error(f"Trip planning failed: {str(e)}")
        return {
            'plans': [],
            'errors': [f"Trip planning failed: {str(e)}"]
        }
