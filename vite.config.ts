
export interface WorkRecord {
  id: string;
  date: string;
  startHour: string;
  endHour: string;
  duration: number;
  value: number;
  weekday: string;
  raiNumber?: string;
  shiftConfig?: {
    label: string;
    color: string;
    textColor: string;
    fontSize: number;
  };
}

export interface AC4RateTable {
  Praca: number;
  Oficial: number;
  OficialSuperior: number;
}

export interface ShiftType {
  id: string;
  name: string;
  label: string;
  color: string;
  textColor: string;
  fontSize?: number;
  startTime?: string;
  endTime?: string;
  showTime?: boolean;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  shiftTypeIds: string[];
  observation: string;
  overrides?: Record<string, { label?: string; color?: string; textColor?: string; fontSize?: number }>;
}

declare global {
  interface Window {
    AndroidWidget?: {
      updateCalendarData: (data: string) => void;
    };
  }
}
