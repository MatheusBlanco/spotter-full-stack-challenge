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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {!tripPlanData ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  Spotter ELD Trip Planner
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Professional trucking route planning with Hours of Service
                  compliance, real-time tracking, and DOT-compliant logging
                </p>
              </div>
              <TripPlanningForm onPlanGenerated={handlePlanGenerated} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <button
                  onClick={handleBackToForm}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
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
