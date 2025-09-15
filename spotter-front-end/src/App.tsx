import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import "./App.css";
import { TripPlanningForm } from "./components/TripPlanningForm";
import { TripResults } from "./components/TripResults";
import { Toaster } from "./components/ui/toaster";
import type { Driver, PlanTripResponse, Trip } from "./services/trips";

const queryClient = new QueryClient();

interface TripPlanData {
  results: PlanTripResponse;
  trip: Trip;
  driver: Driver;
}

function App() {
  const [tripPlanData, setTripPlanData] = useState<TripPlanData | null>(null);

  const handlePlanGenerated = (
    results: PlanTripResponse,
    trip: Trip,
    driver: Driver
  ) => {
    setTripPlanData({ results, trip, driver });
    console.log("Trip plan generated:", results);
  };

  const handleBackToForm = () => {
    setTripPlanData(null);
  };

  const handleGenerateLogs = () => {
    // TODO: Implement log sheet generation
    console.log("Generate log sheets for trip:", tripPlanData?.trip.id);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Spotter ELD Trip Planner
            </h1>
            <p className="text-lg text-gray-600">
              Professional trip planning with Hours of Service compliance
            </p>
          </div>

          {!tripPlanData ? (
            <TripPlanningForm onPlanGenerated={handlePlanGenerated} />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={handleBackToForm}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  ← Plan Another Trip
                </button>
              </div>
              <TripResults
                results={tripPlanData.results}
                trip={tripPlanData.trip}
                driver={tripPlanData.driver}
                onGenerateLogs={handleGenerateLogs}
              />
            </div>
          )}
        </div>
      </div>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
