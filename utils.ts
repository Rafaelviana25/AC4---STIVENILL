
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
export const calculateAC4Value = (dateStr: string, startHourStr: string, duration: number): number => {
  let total = 0;
  // Criamos o objeto de data inicial
  let currentDateTime = new Date(dateStr + 'T' + startHourStr);

  for (let i = 0; i < duration; i++) {
    const hour = currentDateTime.getHours();
    const dayOfWeek = currentDateTime.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
    
    // Identificação do período (Art. 1º Parágrafo Único)
    // Diurno: 05h às 21h (blocos que iniciam nesse intervalo)
    // Noturno: 22h às 04h (blocos que iniciam nesse intervalo, terminando às 05h)
    const isNight = (hour >= 22 || hour <= 4);
    
    // Lógica do Dia Operacional para Noturno:
    // Se a hora é entre 00h e 04h, ela pertence ao "Noturno" do dia anterior.
    // Se a hora é 22h ou 23h, ela pertence ao "Noturno" do dia atual.
    let operationalDay;
    if (isNight && hour <= 4) {
      // Pega o dia anterior para definir se era escala azul ou vermelha
      const tempDate = new Date(currentDateTime);
      tempDate.setDate(tempDate.getDate() - 1);
      operationalDay = tempDate.getDay();
    } else {
      operationalDay = dayOfWeek;
    }

    // Escala Vermelha: Sexta (5), Sábado (6) e Domingo (0)
    const isRedScale = (operationalDay === 5 || operationalDay === 6 || operationalDay === 0);
    
    let rate = 0;
    if (isRedScale) {
      // ESCALA VERMELHA (Art. 2º, II)
      rate = isNight ? 41.38 : 36.41;
    } else {
      // ESCALA AZUL (Art. 2º, I)
      rate = isNight ? 29.80 : 26.47;
    }
    
    total += rate;
    currentDateTime.setHours(currentDateTime.getHours() + 1);
  }
  
  return Number(total.toFixed(2));
};
