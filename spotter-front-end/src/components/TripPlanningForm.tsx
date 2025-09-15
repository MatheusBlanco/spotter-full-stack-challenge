import { Clock, MapPin, Truck, User } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlanTrip, type PlanTripResponse } from "@/services/trips";

interface TripPlanningFormProps {
  onPlanGenerated: (result: PlanTripResponse) => void;
}

export function TripPlanningForm({ onPlanGenerated }: TripPlanningFormProps) {
  const planTripMutation = usePlanTrip();

  // Form state
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    driverName: "",
    licenseNumber: "",
    currentCycleHours: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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
        estimated_duration: 0, // Will be calculated by backend
      },
      driver: {
        name: formData.driverName,
        license_number: formData.licenseNumber,
        current_cycle_hours: formData.currentCycleHours * 60, // Convert to minutes
      },
    };

    planTripMutation.mutate(tripData, {
      onSuccess: (response) => {
        onPlanGenerated(response.data);
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle className="text-2xl">ELD Trip Planner</CardTitle>
            <CardDescription>
              Plan your route with Hours of Service compliance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Route Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  placeholder="e.g., New York, NY or 123 Main St, City, State"
                  value={formData.currentLocation}
                  onChange={(e) =>
                    handleInputChange("currentLocation", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Your starting point for the trip
                </p>
                {errors.currentLocation && (
                  <p className="text-sm text-red-600">
                    {errors.currentLocation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location</Label>
                <Input
                  id="pickupLocation"
                  placeholder="e.g., Brooklyn, NY or 456 Warehouse St, City, State"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    handleInputChange("pickupLocation", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Where you'll pick up the load
                </p>
                {errors.pickupLocation && (
                  <p className="text-sm text-red-600">
                    {errors.pickupLocation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                <Input
                  id="dropoffLocation"
                  placeholder="e.g., Los Angeles, CA or 789 Delivery Ave, City, State"
                  value={formData.dropoffLocation}
                  onChange={(e) =>
                    handleInputChange("dropoffLocation", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Final delivery destination
                </p>
                {errors.dropoffLocation && (
                  <p className="text-sm text-red-600">
                    {errors.dropoffLocation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Driver Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  placeholder="e.g., John Smith"
                  value={formData.driverName}
                  onChange={(e) =>
                    handleInputChange("driverName", e.target.value)
                  }
                />
                {errors.driverName && (
                  <p className="text-sm text-red-600">{errors.driverName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">CDL License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="e.g., DL123456789"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                />
                {errors.licenseNumber && (
                  <p className="text-sm text-red-600">{errors.licenseNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* HOS Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Hours of Service</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCycleHours">
                Current Cycle Hours Used
              </Label>
              <Input
                id="currentCycleHours"
                type="number"
                min="0"
                max="70"
                step="0.5"
                placeholder="0"
                value={formData.currentCycleHours}
                onChange={(e) =>
                  handleInputChange(
                    "currentCycleHours",
                    parseFloat(e.target.value) || 0
                  )
                }
              />
              <p className="text-sm text-gray-500">
                How many hours have you worked in the current 8-day cycle? (0-70
                hours)
              </p>
              {errors.currentCycleHours && (
                <p className="text-sm text-red-600">
                  {errors.currentCycleHours}
                </p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {planTripMutation.isError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="text-red-800 font-semibold mb-2">
                Planning Error
              </h4>
              <p className="text-red-700 text-sm">
                {planTripMutation.error?.message ||
                  "Failed to plan trip. Please check your inputs and try again."}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={planTripMutation.isPending}
          >
            {planTripMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Planning Trip...
              </>
            ) : (
              <>
                <Truck className="h-4 w-4 mr-2" />
                Plan Trip
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
