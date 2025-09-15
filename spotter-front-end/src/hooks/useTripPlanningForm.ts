import {
  usePlanTrip,
  type Driver,
  type PlanTripResponse,
  type Trip,
} from "@/services/trips";
import { useState } from "react";
import { useToast } from "./use-toast";

interface TripFormData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  driverName: string;
  licenseNumber: string;
  currentCycleHours: number;
}

interface FormErrors {
  [key: string]: string;
}

export const useTripPlanningForm = (
  onPlanGenerated: (
    result: PlanTripResponse,
    trip: Trip,
    driver: Driver
  ) => void
) => {
  const planTripMutation = usePlanTrip();
  const { toast } = useToast();

  const [formData, setFormData] = useState<TripFormData>({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    driverName: "",
    licenseNumber: "",
    currentCycleHours: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    field: keyof TripFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentLocation.trim()) {
      newErrors.currentLocation = "Current location is required";
    }
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }
    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = "Dropoff location is required";
    }
    if (!formData.driverName.trim()) {
      newErrors.driverName = "Driver name is required";
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }
    if (formData.currentCycleHours < 0 || formData.currentCycleHours > 70) {
      newErrors.currentCycleHours =
        "Current cycle hours must be between 0 and 70";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tripData = {
      trip: {
        origin: formData.currentLocation,
        pickup_location: formData.pickupLocation,
        destination: formData.dropoffLocation,
        estimated_duration: 0,
      },
      driver: {
        name: formData.driverName,
        license_number: formData.licenseNumber,
        current_cycle_hours: formData.currentCycleHours * 60,
      },
    };

    planTripMutation.mutate(tripData, {
      onSuccess: (response) => {
        const trip: Trip = {
          id: 0,
          origin: formData.currentLocation,
          pickup_location: formData.pickupLocation,
          destination: formData.dropoffLocation,
          estimated_duration: 0,
        };

        const driver: Driver = {
          id: 0,
          name: formData.driverName,
          license_number: formData.licenseNumber,
          current_cycle_hours: formData.currentCycleHours * 60,
        };

        toast({
          title: "Trip Planned Successfully",
          description: "Your route has been calculated with HOS compliance.",
        });

        onPlanGenerated(response.data, trip, driver);
      },
      onError: (error: {
        response?: { data?: Record<string, unknown> };
        message?: string;
      }) => {
        handlePlanningError(error);
      },
    });
  };

  const handlePlanningError = (error: {
    response?: { data?: Record<string, unknown> };
    message?: string;
  }) => {
    if (error.response?.data) {
      const errorData = error.response.data;

      if (errorData.driver_errors) {
        Object.entries(
          errorData.driver_errors as Record<string, string[]>
        ).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          toast({
            variant: "destructive",
            title: "Driver Validation Error",
            description: `${field.replace("_", " ")}: ${message}`,
          });
        });
      }

      if (errorData.trip_errors) {
        Object.entries(
          errorData.trip_errors as Record<string, string[]>
        ).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          toast({
            variant: "destructive",
            title: "Trip Validation Error",
            description: `${field.replace("_", " ")}: ${message}`,
          });
        });
      }

      if (errorData.detail) {
        toast({
          variant: "destructive",
          title: "Planning Error",
          description: errorData.detail as string,
        });
      }

      if (errorData.errors) {
        (errorData.errors as string[]).forEach((errorMsg: string) => {
          toast({
            variant: "destructive",
            title: "Trip Planning Failed",
            description: errorMsg,
          });
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: error.message || "Failed to plan trip. Please try again.",
      });
    }
  };

  return {
    formData,
    errors,
    isLoading: planTripMutation.isPending,
    handleInputChange,
    handleSubmit,
  };
};
