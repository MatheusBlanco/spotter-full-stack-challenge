import {
  createDutyStatusBarsData,
  generateHourMarksData,
} from "@/services/eldLogService";
import type { TripPlan } from "@/services/trips";
import type { CSSProperties } from "react";

export const generateHourMarks = (): React.JSX.Element[] => {
  const marksData = generateHourMarksData();

  return marksData.map((mark) => (
    <div key={mark.hour} className="flex flex-col items-center">
      <div className="w-px h-4 bg-gray-300"></div>
      <span className="text-xs text-gray-600 mt-1">{mark.label}</span>
    </div>
  ));
};

export const createDutyStatusBars = (
  tripPlan: TripPlan
): React.JSX.Element[] => {
  const barsData = createDutyStatusBarsData(tripPlan);

  return barsData.map((bar) => (
    <div
      key={bar.key}
      className={bar.className}
      style={bar.style as CSSProperties}
    >
      <span className={bar.textClassName}>{bar.label}</span>
    </div>
  ));
};
