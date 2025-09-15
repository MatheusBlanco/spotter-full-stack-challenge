import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Driver, TripPlan } from "@/services/trips";
import { Clock, FileText, Truck, User } from "lucide-react";

interface ELDLogSheetProps {
  driver: Driver;
  tripPlan: TripPlan;
  date: string;
  tripOrigin: string;
  tripDestination: string;
}

const dutyStatusOptions = [
  { code: "OFF", label: "Off Duty", color: "bg-gray-400" },
  { code: "SB", label: "Sleeper Berth", color: "bg-blue-400" },
  { code: "D", label: "Driving", color: "bg-green-400" },
  { code: "ON", label: "On Duty (Not Driving)", color: "bg-yellow-400" },
];

// Helper function to convert decimal hours to HH:MM format
const formatHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

// Generate 24-hour grid marks
const generateHourMarks = () => {
  const marks = [];
  for (let hour = 0; hour < 24; hour++) {
    marks.push(
      <div key={hour} className="flex flex-col items-center">
        <div className="w-px h-4 bg-gray-300"></div>
        <span className="text-xs text-gray-600 mt-1">
          {hour === 0
            ? "12 AM"
            : hour < 12
            ? `${hour} AM`
            : hour === 12
            ? "12 PM"
            : `${hour - 12} PM`}
        </span>
      </div>
    );
  }
  return marks;
};

// Create duty status bars based on trip plan
const createDutyStatusBars = (tripPlan: TripPlan) => {
  const bars = [];
  const totalHours = 24;

  // Convert hours to percentages for the 24-hour grid
  const offDutyPercent = (tripPlan.off_duty_hours / totalHours) * 100;
  const drivingPercent = (tripPlan.driving_hours / totalHours) * 100;
  const onDutyPercent =
    ((tripPlan.on_duty_hours - tripPlan.driving_hours) / totalHours) * 100;

  let currentPosition = 0;

  // Off duty period (typically at start of day for rest)
  if (tripPlan.off_duty_hours > 0) {
    bars.push(
      <div
        key="off-duty"
        className="h-6 bg-gray-400 border border-gray-500"
        style={{
          width: `${offDutyPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        }}
      >
        <span className="text-xs text-white px-1">OFF</span>
      </div>
    );
    currentPosition += offDutyPercent;
  }

  // On duty (not driving) - pre-trip, loading, etc.
  if (onDutyPercent > 0) {
    bars.push(
      <div
        key="on-duty"
        className="h-6 bg-yellow-400 border border-yellow-500"
        style={{
          width: `${onDutyPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        }}
      >
        <span className="text-xs text-black px-1">ON</span>
      </div>
    );
    currentPosition += onDutyPercent;
  }

  // Driving period
  if (drivingPercent > 0) {
    bars.push(
      <div
        key="driving"
        className="h-6 bg-green-400 border border-green-500"
        style={{
          width: `${drivingPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        }}
      >
        <span className="text-xs text-white px-1">DRIVING</span>
      </div>
    );
  }

  return bars;
};

export function ELDLogSheet({
  driver,
  tripPlan,
  date,
  tripOrigin,
  tripDestination,
}: ELDLogSheetProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto print:shadow-none">
      <CardHeader className="border-b-2 border-black print:border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <CardTitle className="text-xl">Driver's Daily Log Sheet</CardTitle>
          </div>
          <div className="text-sm text-gray-600">
            DOT Compliant - FMCSR Part 395
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Driver and Vehicle Information */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-semibold">Driver Information</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span className="border-b border-gray-400 min-w-48 text-center">
                  {driver.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">License #:</span>
                <span className="border-b border-gray-400 min-w-48 text-center">
                  {driver.license_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span className="border-b border-gray-400 min-w-48 text-center">
                  {date}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="font-semibold">Trip Information</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">From:</span>
                <span className="border-b border-gray-400 min-w-48 text-center text-xs">
                  {tripOrigin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">To:</span>
                <span className="border-b border-gray-400 min-w-48 text-center text-xs">
                  {tripDestination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Miles:</span>
                <span className="border-b border-gray-400 min-w-48 text-center">
                  _______
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Duty Status Legend */}
        <div className="border-2 border-black p-3">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Duty Status Legend
          </h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            {dutyStatusOptions.map((status) => (
              <div key={status.code} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 ${status.color} border border-gray-600`}
                ></div>
                <span className="font-medium">{status.code}</span>
                <span className="text-xs">{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Grid and Duty Status Chart */}
        <div className="border-2 border-black">
          <div className="bg-gray-100 p-2 border-b border-black">
            <h3 className="font-semibold text-center">
              24-Hour Period Grid - Duty Status Record
            </h3>
            <p className="text-xs text-center text-gray-600">
              Midnight to Midnight (Use Local Time at Principal Place of
              Business)
            </p>
          </div>

          {/* Hour markers */}
          <div className="relative border-b border-gray-400">
            <div className="flex justify-between items-end px-2 py-2 bg-gray-50">
              {generateHourMarks()}
            </div>
          </div>

          {/* Duty status chart area */}
          <div className="relative h-32 bg-white border-b border-black">
            {/* Grid lines for hours */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="border-r border-gray-200 flex-1"
                  style={{ borderRight: i === 23 ? "none" : undefined }}
                />
              ))}
            </div>

            {/* Duty status lines */}
            <div className="absolute inset-0 flex flex-col">
              {dutyStatusOptions.map((status, index) => (
                <div
                  key={status.code}
                  className="flex-1 border-b border-gray-300 relative flex items-center"
                  style={{
                    borderBottom:
                      index === dutyStatusOptions.length - 1
                        ? "none"
                        : undefined,
                  }}
                >
                  <span className="absolute left-2 text-xs font-medium bg-white px-1">
                    {status.code}
                  </span>
                </div>
              ))}
            </div>

            {/* Duty status bars based on trip plan */}
            <div className="absolute inset-0 pt-6">
              {createDutyStatusBars(tripPlan)}
            </div>
          </div>
        </div>

        {/* Hours Summary */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border-2 border-black p-4">
            <h3 className="font-semibold mb-3">
              Hours Summary for This Duty Period
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span>Off Duty:</span>
                <span className="font-medium">
                  {formatHours(tripPlan.off_duty_hours)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span>Sleeper Berth:</span>
                <span className="font-medium">00:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-1">
                <span>Driving:</span>
                <span className="font-medium">
                  {formatHours(tripPlan.driving_hours)}
                </span>
              </div>
              <div className="flex justify-between border-b-2 border-black pb-1">
                <span>On Duty (Not Driving):</span>
                <span className="font-medium">
                  {formatHours(tripPlan.on_duty_hours - tripPlan.driving_hours)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total On Duty:</span>
                <span>{formatHours(tripPlan.on_duty_hours)}</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-black p-4">
            <h3 className="font-semibold mb-3">Certification</h3>
            <div className="space-y-4 text-sm">
              <p className="text-xs leading-relaxed">
                I certify that all entries required by 49 CFR 395.8 have been
                made, that the record is true and correct, and that I was not
                driving a commercial motor vehicle during off-duty periods.
              </p>
              <div className="space-y-3">
                <div>
                  <span className="text-xs">Driver Signature:</span>
                  <div className="border-b border-gray-400 h-8 mt-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs">Date:</span>
                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-xs">Total Miles Today:</span>
                    <div className="border-b border-gray-400 h-6 mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="border-2 border-black p-4">
          <h3 className="font-semibold mb-2">Remarks</h3>
          <div className="min-h-20 border border-gray-300 p-2 text-sm bg-gray-50">
            <p className="text-gray-600">
              Trip planned using Spotter ELD System. Route: {tripOrigin} to{" "}
              {tripDestination}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
