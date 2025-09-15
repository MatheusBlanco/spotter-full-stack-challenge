import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Truck,
  User,
} from "lucide-react";

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
import { useTripPlanningForm } from "@/hooks/useTripPlanningForm";
import {
  type Driver,
  type PlanTripResponse,
  type Trip,
} from "@/services/trips";

interface TripPlanningFormProps {
  onPlanGenerated: (
    result: PlanTripResponse,
    trip: Trip,
    driver: Driver
  ) => void;
}

export function TripPlanningForm({ onPlanGenerated }: TripPlanningFormProps) {
  const { formData, errors, isLoading, handleInputChange, handleSubmit } =
    useTripPlanningForm(onPlanGenerated);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <span className="font-medium text-blue-700">
                  Plan Your Trip
                </span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-semibold">2</span>
                </div>
                <span className="text-gray-500">Review Results</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-semibold">3</span>
                </div>
                <span className="text-gray-500">Generate Logs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">ELD Trip Planner</CardTitle>
              <CardDescription className="text-blue-100">
                Plan your route with Hours of Service compliance and safety
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Route Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Define your trip waypoints and destinations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="currentLocation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Current Location *
                  </Label>
                  <Input
                    id="currentLocation"
                    placeholder="e.g., 1234 Main St, Houston, TX or Houston, Texas"
                    value={formData.currentLocation}
                    onChange={(e) =>
                      handleInputChange("currentLocation", e.target.value)
                    }
                    className={`${
                      errors.currentLocation
                        ? "border-red-500 ring-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Your starting point for this trip</span>
                  </div>
                  {errors.currentLocation && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.currentLocation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="pickupLocation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Pickup Location *
                  </Label>
                  <Input
                    id="pickupLocation"
                    placeholder="e.g., 5678 Industrial Blvd, Dallas, TX or Dallas Distribution Center"
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      handleInputChange("pickupLocation", e.target.value)
                    }
                    className={`${
                      errors.pickupLocation
                        ? "border-red-500 ring-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="h-4 w-4" />
                    <span>Where you'll collect your cargo/load</span>
                  </div>
                  {errors.pickupLocation && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.pickupLocation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="dropoffLocation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Delivery Location *
                  </Label>
                  <Input
                    id="dropoffLocation"
                    placeholder="e.g., 9876 Commerce St, Los Angeles, CA or LA Warehouse Complex"
                    value={formData.dropoffLocation}
                    onChange={(e) =>
                      handleInputChange("dropoffLocation", e.target.value)
                    }
                    className={`${
                      errors.dropoffLocation
                        ? "border-red-500 ring-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Final destination for cargo delivery</span>
                  </div>
                  {errors.dropoffLocation && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.dropoffLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Driver Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professional driver details and credentials
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="driverName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Driver Name *
                  </Label>
                  <Input
                    id="driverName"
                    placeholder="e.g., John Smith"
                    value={formData.driverName}
                    onChange={(e) =>
                      handleInputChange("driverName", e.target.value)
                    }
                    className={`${
                      errors.driverName
                        ? "border-red-500 ring-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.driverName && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.driverName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="licenseNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    CDL License Number *
                  </Label>
                  <Input
                    id="licenseNumber"
                    placeholder="e.g., DL123456789 or TX123456789"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                    className={`${
                      errors.licenseNumber
                        ? "border-red-500 ring-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.licenseNumber && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.licenseNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hours of Service (HOS)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Current duty cycle status for compliance planning
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800 mb-2">
                        Federal HOS Limits Reminder
                      </h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Maximum 11 hours driving per day</li>
                        <li>• Maximum 14 hours on-duty per day</li>
                        <li>• Maximum 70 hours in 8 consecutive days</li>
                        <li>• Minimum 10 hours off-duty between shifts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="currentCycleHours"
                    className="text-sm font-medium text-gray-700"
                  >
                    Current 8-Day Cycle Hours Used
                  </Label>
                  <div className="relative">
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
                      className={`${
                        errors.currentCycleHours
                          ? "border-red-500 ring-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-16`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      hours
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>Hours used in your current 8-day cycle</span>
                    </div>
                    <div className="text-gray-500">
                      {70 - formData.currentCycleHours} hours remaining
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        formData.currentCycleHours > 60
                          ? "bg-red-500"
                          : formData.currentCycleHours > 50
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (formData.currentCycleHours / 70) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  {errors.currentCycleHours && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{errors.currentCycleHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Planning Your Trip...</span>
                    <div className="text-sm opacity-75">Please wait</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Calculate Route & HOS Plan</span>
                    <CheckCircle className="h-5 w-5 opacity-75" />
                  </div>
                )}
              </Button>

              {!isLoading && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  We'll calculate your route, check HOS compliance, and plan
                  fuel stops
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
