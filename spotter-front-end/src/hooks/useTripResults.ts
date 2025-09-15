import type { PlanTripResponse } from "@/services/trips";
import { useState } from "react";

export const useTripResults = (results: PlanTripResponse) => {
  const { plans } = results;
  const [showLogSheets, setShowLogSheets] = useState(false);

  const hasErrors = plans.some(
    (plan: { errors?: string[] }) => plan.errors && plan.errors.length > 0
  );

  const handleBackToResults = () => {
    setShowLogSheets(false);
  };

  return {
    showLogSheets,
    hasErrors,
    handleBackToResults,
  };
};
