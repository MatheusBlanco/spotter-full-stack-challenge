import apiClient from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// Types
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
  driving: string;
  on_duty: string;
  errors?: string[];
}

export interface PlanTripRequest {
  trip: Omit<Trip, "id">;
  driver: Omit<Driver, "id">;
}

export interface PlanTripResponse {
  plans: TripPlan[];
  planning_errors?: string[];
}

// API Functions
export const tripsApi = {
  planTrip: (data: PlanTripRequest) =>
    apiClient.post<PlanTripResponse>("/trips/plan/", data),

  generateLogSheets: (tripId: number, driverId: number) =>
    apiClient.post(`/trips/${tripId}/logs/`, { driver_id: driverId }),

  getDriverCycle: (driverId: number) =>
    apiClient.get(`/trips/drivers/${driverId}/cycle/`),
};

// React Query Hooks
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

export const useGenerateLogSheets = () => {
  return useMutation({
    mutationFn: ({ tripId, driverId }: { tripId: number; driverId: number }) =>
      tripsApi.generateLogSheets(tripId, driverId),
  });
};

export const useDriverCycle = (driverId: number, enabled = true) => {
  return useQuery({
    queryKey: ["driver-cycle", driverId],
    queryFn: () => tripsApi.getDriverCycle(driverId),
    enabled: enabled && !!driverId,
  });
};
