export interface DutyStatusOption {
  code: string;
  label: string;
  color: string;
}

export const dutyStatusOptions: DutyStatusOption[] = [
  { code: "OFF", label: "Off Duty", color: "bg-gray-400" },
  { code: "SB", label: "Sleeper Berth", color: "bg-blue-400" },
  { code: "D", label: "Driving", color: "bg-green-400" },
  { code: "ON", label: "On Duty (Not Driving)", color: "bg-yellow-400" },
];

export const dutyStatusColors = {
  OFF: "bg-gray-400",
  SB: "bg-blue-400",
  D: "bg-green-400",
  ON: "bg-yellow-400",
} as const;

export const dutyStatusBorderColors = {
  OFF: "border-gray-500",
  SB: "border-blue-500",
  D: "border-green-500",
  ON: "border-yellow-500",
} as const;

export const dutyStatusTextColors = {
  OFF: "text-white",
  SB: "text-white",
  D: "text-white",
  ON: "text-black",
} as const;
