import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTripResults } from "@/hooks/useTripResults";
import { transformCoordinatesForMap } from "@/services/routeMapService";
import type { Driver, PlanTripResponse, Trip } from "@/services/trips";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Fuel,
  MapPin,
  Truck,
} from "lucide-react";
import { ELDLogSheet } from "./ELDLogSheet";
import { RouteMap } from "./RouteMap";

interface TripResultsProps {
  results: PlanTripResponse;
  trip: Trip;
  driver: Driver;
}

export function TripResults({ results, trip, driver }: TripResultsProps) {
  const { plans, summary, fuel_stops } = results;
  const { showLogSheets, hasErrors, handleBackToResults } =
    useTripResults(results);

  const mapProps = transformCoordinatesForMap(results, trip);

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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 opacity-50">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-green-700">Plan Your Trip</span>
              </div>
              <div className="w-12 h-0.5 bg-green-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <span className="font-medium text-green-700">
                  Review Results
                </span>
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
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Trip Planning Results
          </h2>
          <p className="text-gray-600">
            Route:{" "}
            <span className="font-medium text-blue-600">{trip.origin}</span> →
            <span className="font-medium text-green-600 mx-1">
              {trip.pickup_location}
            </span>{" "}
            →
            <span className="font-medium text-red-600">{trip.destination}</span>
          </p>
        </div>
      </div>

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
        <div className="space-y-6">
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
