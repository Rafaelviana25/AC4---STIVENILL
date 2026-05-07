
export interface WorkRecord {
  id: string;
  date: string;
  startHour: string;
  endHour: string;
  duration: number;
  value: number;
  weekday: string;
  raiNumber?: string;
}

export interface AC4RateTable {
  Praca: number;
  Oficial: number;
  OficialSuperior: number;
}

declare global {
  interface Window {
    AndroidWidget?: {
      updateCalendarData: (data: string) => void;
    };
  }
}
