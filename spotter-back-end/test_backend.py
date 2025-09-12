#!/usr/bin/env python3
"""
Quick test script to verify backend API functionality
"""
import requests

# API endpoint
BASE_URL = "http://127.0.0.1:8001/api"


def test_trip_planning():
    """Test the trip planning endpoint"""

    # Test data
    test_data = {
        "trip": {
            "origin": "New York, NY",
            "destination": "Los Angeles, CA",
            "pickup_location": "Brooklyn, NY",
            "estimated_duration": 2520  # 42 hours in minutes
        },
        "driver": {
            "name": "Test Driver",
            "license_number": "TEST123",
            "current_cycle_hours": 1800  # 30 hours in minutes
        }
    }

    try:
        print("🚛 Testing trip planning endpoint...")
        response = requests.post(
            f"{BASE_URL}/trips/plan/",
            headers={"Content-Type": "application/json"},
            json=test_data,
            timeout=30
        )

        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Trip planning successful!")

            if 'plans' in result:
                print(f"📅 Generated {len(result['plans'])} daily plans")
                for i, plan in enumerate(result['plans'], 1):
                    print(
                        f"  Day {i}: {plan.get('driving_hours', 0):.1f}h driving, {plan.get('on_duty_hours', 0):.1f}h on-duty")

            if 'summary' in result:
                summary = result['summary']
                print("📊 Trip Summary:")
                print(
                    f"  Total Distance: {summary.get('total_distance_miles', 0):.1f} miles")
                print(
                    f"  Total Driving: {summary.get('total_driving_hours', 0):.1f} hours")
                print(f"  Estimated Days: {summary.get('estimated_days', 0)}")
                print(f"  Fuel Stops: {len(summary.get('fuel_stops', []))}")

        else:
            print(f"❌ Error: {response.status_code}")
            print(response.json())

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        print("Make sure Django server is running on port 8000")


if __name__ == "__main__":
    test_trip_planning()
