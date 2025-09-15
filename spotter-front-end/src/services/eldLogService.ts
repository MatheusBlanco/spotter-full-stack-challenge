import type { TripPlan } from "@/services/trips";

export interface DutyStatusBar {
  key: string;
  className: string;
  style: {
    width: string;
    left: string;
    position: string;
  };
  label: string;
  textClassName: string;
}

export interface HourMark {
  hour: number;
  label: string;
}

export class ELDLogService {
  static formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  static generateHourMarksData = (): HourMark[] => {
    const marks: HourMark[] = [];
    for (let hour = 0; hour < 24; hour++) {
      marks.push({
        hour,
        label:
          hour === 0
            ? "12 AM"
            : hour < 12
            ? `${hour} AM`
            : hour === 12
            ? "12 PM"
            : `${hour - 12} PM`,
      });
    }
    return marks;
  };

  static createDutyStatusBarsData = (tripPlan: TripPlan): DutyStatusBar[] => {
    const bars: DutyStatusBar[] = [];
    const totalHours = 24;

    const offDutyPercent = (tripPlan.off_duty_hours / totalHours) * 100;
    const drivingPercent = (tripPlan.driving_hours / totalHours) * 100;
    const onDutyPercent =
      ((tripPlan.on_duty_hours - tripPlan.driving_hours) / totalHours) * 100;

    let currentPosition = 0;

    if (tripPlan.off_duty_hours > 0) {
      bars.push({
        key: "off-duty",
        className: "h-6 bg-gray-400 border border-gray-500",
        style: {
          width: `${offDutyPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        },
        label: "OFF",
        textClassName: "text-xs text-white px-1",
      });
      currentPosition += offDutyPercent;
    }

    if (onDutyPercent > 0) {
      bars.push({
        key: "on-duty",
        className: "h-6 bg-yellow-400 border border-yellow-500",
        style: {
          width: `${onDutyPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        },
        label: "ON",
        textClassName: "text-xs text-black px-1",
      });
      currentPosition += onDutyPercent;
    }

    if (drivingPercent > 0) {
      bars.push({
        key: "driving",
        className: "h-6 bg-green-400 border border-green-500",
        style: {
          width: `${drivingPercent}%`,
          left: `${currentPosition}%`,
          position: "absolute",
        },
        label: "DRIVING",
        textClassName: "text-xs text-white px-1",
      });
    }

    return bars;
  };

  static calculateDutyStatusPercentages = (tripPlan: TripPlan) => {
    const totalHours = 24;
    return {
      offDutyPercent: (tripPlan.off_duty_hours / totalHours) * 100,
      drivingPercent: (tripPlan.driving_hours / totalHours) * 100,
      onDutyPercent:
        ((tripPlan.on_duty_hours - tripPlan.driving_hours) / totalHours) * 100,
    };
  };

  static validateHOSCompliance = (tripPlan: TripPlan) => {
    const violations = [];
    const maxDrivingHours = 11;
    const maxOnDutyHours = 14;
    const minOffDutyHours = 10;

    if (tripPlan.driving_hours > maxDrivingHours) {
      violations.push(
        `Driving hours exceed limit: ${ELDLogService.formatHours(
          tripPlan.driving_hours
        )} > ${maxDrivingHours}:00`
      );
    }

    if (tripPlan.on_duty_hours > maxOnDutyHours) {
      violations.push(
        `On-duty hours exceed limit: ${ELDLogService.formatHours(
          tripPlan.on_duty_hours
        )} > ${maxOnDutyHours}:00`
      );
    }

    if (tripPlan.off_duty_hours < minOffDutyHours) {
      violations.push(
        `Insufficient off-duty hours: ${ELDLogService.formatHours(
          tripPlan.off_duty_hours
        )} < ${minOffDutyHours}:00`
      );
    }

    return {
      isCompliant: violations.length === 0,
      violations,
    };
  };

  static generateHoursSummary = (tripPlan: TripPlan) => {
    return {
      offDuty: ELDLogService.formatHours(tripPlan.off_duty_hours),
      sleeperBerth: "00:00",
      driving: ELDLogService.formatHours(tripPlan.driving_hours),
      onDutyNotDriving: ELDLogService.formatHours(
        tripPlan.on_duty_hours - tripPlan.driving_hours
      ),
      totalOnDuty: ELDLogService.formatHours(tripPlan.on_duty_hours),
    };
  };
}

export const {
  formatHours,
  generateHourMarksData,
  createDutyStatusBarsData,
  calculateDutyStatusPercentages,
  validateHOSCompliance,
  generateHoursSummary,
} = ELDLogService;
