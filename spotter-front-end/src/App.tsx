import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import "./App.css";
import { TripPlanningForm } from "./components/TripPlanningForm";
import type { PlanTripResponse } from "./services/trips";

const queryClient = new QueryClient();

function App() {
  const [tripPlan, setTripPlan] = useState<PlanTripResponse | null>(null);

  const handlePlanGenerated = (plan: PlanTripResponse) => {
    setTripPlan(plan);
    console.log("Trip plan generated:", plan);
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

          <TripPlanningForm onPlanGenerated={handlePlanGenerated} />

          {/* Display Trip Plan Results */}
          {tripPlan && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Trip Plan Generated
                </h2>
                <div className="space-y-4">
                  {tripPlan.plans.map((plan, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">
                        Day {index + 1}: {plan.date}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-blue-600">
                            Driving Hours:
                          </span>
                          <span className="ml-2">{plan.driving}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-600">
                            On-Duty Hours:
                          </span>
                          <span className="ml-2">{plan.on_duty}</span>
                        </div>
                      </div>
                      {plan.errors && plan.errors.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium text-red-600">
                            Warnings:
                          </span>
                          <ul className="list-disc list-inside text-red-600 text-sm mt-1">
                            {plan.errors.map((error, errorIndex) => (
                              <li key={errorIndex}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {tripPlan.planning_errors &&
                  tripPlan.planning_errors.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-red-800 font-semibold mb-2">
                        Planning Issues:
                      </h4>
                      <ul className="list-disc list-inside text-red-700 text-sm">
                        {tripPlan.planning_errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
