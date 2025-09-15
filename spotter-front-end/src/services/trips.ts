import apiClient from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  current_cycle_hours: number;
}

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  pickup_location: string;
  estimated_duration: number;
  origin_lat?: number;
  origin_long?: number;
  pickup_lat?: number;
  pickup_long?: number;
  dropoff_lat?: number;
  dropoff_long?: number;
}

export interface TripPlan {
  date: string;
  driving_hours: number;
  on_duty_hours: number;
  off_duty_hours: number;
  status: string;
  errors?: string[];
}

export interface FuelStop {
  distance_from_start: number;
  location: string;
  fuel_amount: number;
}

export interface TripSummary {
  total_distance_miles: number;
  total_driving_hours: number;
  estimated_days: number;
  fuel_stops: FuelStop[];
  coordinates: [number, number][];
}

export interface PlanTripRequest {
  trip: Omit<Trip, "id">;
  driver: Omit<Driver, "id">;
}

export interface PlanTripResponse {
  plans: TripPlan[];
  summary: TripSummary;
  fuel_stops: FuelStop[];
  planning_errors?: string[];
  errors?: string[];
}

export const tripsApi = {
  planTrip: (data: PlanTripRequest) =>
    apiClient.post<PlanTripResponse>("/trips/plan/", data),

  getDriverCycle: (driverId: number) =>
    apiClient.get(`/trips/drivers/${driverId}/cycle/`),
};

export const usePlanTrip = () => {
  return useMutation({
    mutationFn: tripsApi.planTrip,
    onSuccess: (data) => {
      console.log("Trip planned successfully:", data.data);
    },
    onError: (error) => {
      console.error("Failed to plan trip:", error);
    },
  });
};

export const useDriverCycle = (driverId: number, enabled = true) => {
  return useQuery({
    queryKey: ["driver-cycle", driverId],
    queryFn: () => tripsApi.getDriverCycle(driverId),
    enabled: enabled && !!driverId,
  });
};
