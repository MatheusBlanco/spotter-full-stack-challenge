import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Driver, PlanTripResponse, Trip } from "@/services/trips";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Fuel,
  MapPin,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { ELDLogSheet } from "./ELDLogSheet";
import { RouteMap, type RouteMapProps } from "./RouteMap";

interface TripResultsProps {
  results: PlanTripResponse;
  trip: Trip;
  driver: Driver;
  onGenerateLogs?: () => void;
}

export function TripResults({
  results,
  trip,
  driver,
  onGenerateLogs,
}: TripResultsProps) {
  const { plans, summary, fuel_stops } = results;
  const [showLogSheets, setShowLogSheets] = useState(false);
  const { toast } = useToast();

  // Convert backend coordinates format [lng, lat] to RouteMap format
  const mapProps: RouteMapProps = {
    points: summary.coordinates.map(([lng, lat], index) => {
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
    }),
    routeCoordinates: summary.coordinates.map(([lng, lat]) => [lat, lng]),
  };

  const hasErrors = plans.some((plan) => plan.errors && plan.errors.length > 0);

  const handleGenerateLogs = () => {
    setShowLogSheets(true);
    toast({
      title: "Log Sheets Generated",
      description: `Created ${plans.length} daily log sheet${
        plans.length > 1 ? "s" : ""
      } for your trip.`,
    });
    onGenerateLogs?.();
  };

  const handleBackToResults = () => {
    setShowLogSheets(false);
  };

  if (showLogSheets) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToResults}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            ← Back to Results
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileText size={16} />
              Print Log Sheets
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {plans.map((plan, index) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + index);
            const dateString = currentDate.toLocaleDateString();

            return (
              <ELDLogSheet
                key={index}
                driver={driver}
                tripPlan={plan}
                date={dateString}
                tripOrigin={trip.origin}
                tripDestination={trip.destination}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trip Planning Results</h2>
        {onGenerateLogs && (
          <button
            onClick={handleGenerateLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Calendar size={16} />
            Generate Log Sheets
          </button>
        )}
      </div>

      {/* Error Alert */}
      {hasErrors && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">
              HOS Violations Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Some daily plans exceed federal HOS limits. Review the schedule
              below.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trip Summary & Daily Plans */}
        <div className="space-y-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Trip Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="text-lg font-semibold">
                    {summary.total_distance_miles} miles
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driving Time</p>
                  <p className="text-lg font-semibold">
                    {summary.total_driving_hours.toFixed(1)} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Days</p>
                  <p className="text-lg font-semibold">
                    {summary.estimated_days} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="text-lg font-semibold">{driver.name}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Route</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>{trip.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>{trip.pickup_location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>{trip.destination}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Stops */}
          {fuel_stops && fuel_stops.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Planned Fuel Stops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fuel_stops.map((stop, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{stop.location}</p>
                        <p className="text-sm text-gray-600">
                          At {stop.distance_from_start} miles
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{stop.fuel_amount} gal</p>
                        <p className="text-sm text-gray-600">Estimated</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily HOS Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      plan.errors && plan.errors.length > 0
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Day {index + 1}</h4>
                      <span className="text-sm text-gray-600">{plan.date}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Driving</p>
                        <p className="font-medium">
                          {plan.driving_hours.toFixed(1)}h
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">On Duty</p>
                        <p className="font-medium">
                          {plan.on_duty_hours.toFixed(1)}h
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Off Duty</p>
                        <p className="font-medium">
                          {plan.off_duty_hours.toFixed(1)}h
                        </p>
                      </div>
                    </div>

                    {plan.errors && plan.errors.length > 0 && (
                      <div className="mt-3 p-2 bg-red-100 rounded">
                        <p className="text-sm text-red-700 font-medium">
                          HOS Violations:
                        </p>
                        <ul className="text-sm text-red-600 mt-1">
                          {plan.errors.map((error, errorIndex) => (
                            <li key={errorIndex}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-96">
                <RouteMap {...mapProps} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
