import os

import openrouteservice
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('OPENROUTESERVICE_API_KEY')


def get_route(coordinates):
    client = openrouteservice.Client(key=API_KEY)
    route = client.directions(
        coordinates=coordinates,
        profile='driving-car',
        format='geojson'
    )
    return route


def get_distance_matrix(locations):
    client = openrouteservice.Client(key=API_KEY)
    matrix = client.distance_matrix(
        locations=locations,
        profile='driving-car',
        metrics=['distance', 'duration']
    )
    return matrix
