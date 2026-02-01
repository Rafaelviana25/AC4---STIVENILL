
import { ShiftType } from './types';

export const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DEFAULT_SHIFT_TYPES: ShiftType[] = [
  { id: 'ordinario', name: 'TURNO', label: 'TURNO', color: '#0000FF', textColor: '#FFFFFF', fontSize: 8 },
  { id: 'extra_ac4', name: 'EXTRA AC4', label: 'EXTRA', color: '#EF4444', textColor: '#FFFFFF', fontSize: 10 }
];

export const AC4_RULES = {
  BLUE: { DAY: 26.47, NIGHT: 29.80 },
  RED: { DAY: 36.41, NIGHT: 41.38 }
};

export const DEFAULT_RATES = {
  Praca: 26.47,
  Oficial: 35.00,
  OficialSuperior: 45.00
};

export const WHATSAPP_GROUPS = [
  { id: '1', name: 'Coordenação Capital - PMGO', admin: 'Sgt. Plantão', phone: '5562999999999' },
  { id: '2', name: 'Interior - 1º CRPM', admin: 'Subten. Coord.', phone: '5562888888888' },
  { id: '3', name: 'Unidades Especializadas', admin: 'Cabo Auxiliar', phone: '5562777777777' }
];

/**
 * Feriados e Pontos Facultativos (Formato MM-DD para recorrência anual)
 * Mapeado conforme as datas específicas solicitadas (DD/MM -> MM-DD)
 */
export const HOLIDAYS: Record<string, string> = {
  // Feriados Nacionais
  "01-01": "Ano Novo",
  "04-03": "Sexta-feira Santa",
  "04-21": "Dia de Tiradentes",
  "05-01": "Dia do Trabalho",
  "09-07": "Independência do Brasil",
  "10-12": "Nossa Sra. Aparecida",
  "11-02": "Dia de Finados",
  "11-15": "Proclamação da República",
  "11-20": "Dia da Consciência Negra",
  "12-25": "Natal",
  
  // Pontos Facultativos
  "02-16": "Carnaval",
  "02-17": "Carnaval",
  "02-18": "Quarta-feira de Cinzas",
  "06-04": "Corpus Christi"
};
