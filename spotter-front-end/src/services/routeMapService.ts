import type { RouteMapProps } from "@/components/RouteMap";
import type { PlanTripResponse, Trip } from "@/services/trips";

export interface RouteMapService {
  transformToMapProps(results: PlanTripResponse, trip: Trip): RouteMapProps;
}

export const routeMapService: RouteMapService = {
  transformToMapProps(results: PlanTripResponse, trip: Trip): RouteMapProps {
    const { summary } = results;

    const points = summary.coordinates.map(([lng, lat], index) => {
      let type: "origin" | "pickup" | "destination" | "fuel" | "rest";
      let name: string;

      if (index === 0) {
        type = "origin";
        name = trip.origin || "Origin";
      } else if (index === 1) {
        type = "pickup";
        name = trip.pickup_location || "Pickup Location";
      } else if (index === summary.coordinates.length - 1) {
        type = "destination";
        name = trip.destination || "Destination";
      } else {
        type = "rest";
        name = `Stop ${index}`;
      }

      return {
        lat,
        lng,
        type,
        name,
        description:
          type === "pickup"
            ? "Load pickup point"
            : type === "destination"
            ? "Final delivery point"
            : type === "origin"
            ? "Trip start point"
            : "Route stop",
      };
    });

    return {
      points,
      routeCoordinates: summary.coordinates.map(([lng, lat]) => [lat, lng]),
    };
  },
};

export const transformCoordinatesForMap = (
  results: PlanTripResponse,
  trip: Trip
): RouteMapProps => {
  return routeMapService.transformToMapProps(results, trip);
};
