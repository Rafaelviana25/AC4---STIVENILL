
import { DAYS_OF_WEEK, AC4_RULES, MONTH_NAMES as MONTHS } from './constants';

export const MONTH_NAMES = MONTHS;

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getWeekdayName = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return DAYS_OF_WEEK[date.getDay()];
};

export const getMonthName = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return MONTH_NAMES[date.getMonth()];
};

export const calculateEndHour = (startHour: string, duration: number): string => {
  if (!startHour) return '--';
  const [h, m] = startHour.split(':').map(Number);
  const endH = (h + duration) % 24;
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const generateHoursOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, '0');
    options.push(`${hour}:00`);
  }
  return options;
};

/**
 * Cálculo AC4 baseando-se nas diretrizes de períodos operacionais:
 * DIURNO: 05h01 às 21h59
 * NOTURNO: 22h00 às 05h00 do dia seguinte
 * 
 * A lógica de 'Dia Operacional' garante que o Noturno iniciado às 22h 
 * mantenha o valor do dia de início até as 05h do dia seguinte.
 */
export const calculateAC4Breakdown = (dateStr: string, startHourStr: string, duration: number) => {
  let redHours = 0, redVal = 0, blueHours = 0, blueVal = 0;
  let currentDateTime = new Date(dateStr + 'T' + startHourStr);
  
  for (let i = 0; i < duration; i++) {
    const hour = currentDateTime.getHours();
    const dayOfWeek = currentDateTime.getDay();
    const isNight = (hour >= 22 || hour <= 4);
    
    let operationalDay;
    if (isNight && hour <= 4) {
      const tempDate = new Date(currentDateTime);
      tempDate.setDate(tempDate.getDate() - 1);
      operationalDay = tempDate.getDay();
    } else {
      operationalDay = dayOfWeek;
    }

    const isRedScale = (operationalDay === 5 || operationalDay === 6 || operationalDay === 0);
    const rate = isRedScale ? (isNight ? 41.38 : 36.41) : (isNight ? 29.80 : 26.47);
    
    if (isRedScale) {
      redHours += 1;
      redVal += rate;
    } else {
      blueHours += 1;
      blueVal += rate;
    }
    
    currentDateTime.setHours(currentDateTime.getHours() + 1);
  }
  
  return {
    redHours,
    redVal: Number(redVal.toFixed(2)),
    blueHours,
    blueVal: Number(blueVal.toFixed(2))
  };
};

export const calculateAC4Value = (dateStr: string, startHourStr: string, duration: number): number => {
  const breakdown = calculateAC4Breakdown(dateStr, startHourStr, duration);
  return Number((breakdown.redVal + breakdown.blueVal).toFixed(2));
};
