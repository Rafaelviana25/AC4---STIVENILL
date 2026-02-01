
import React, { useState, useMemo } from 'react';
import { WorkRecord } from '../types';
import { formatCurrency, getWeekdayName, calculateEndHour, generateHoursOptions, calculateAC4Value } from '../utils';

interface CalculatorTabProps {
  onAddRecord: (record: WorkRecord) => void;
  records: WorkRecord[];
  onRemoveRecord: (id: string) => void;
  onExportPDF: () => void;
  onCopyAll: () => void;
  onPostToMonthly: () => void;
}

const CalculatorTab: React.FC<CalculatorTabProps> = ({ 
  onAddRecord, 
  records, 
  onRemoveRecord,
  onPostToMonthly
}) => {
  const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getLocalDate());
  const [startHour, setStartHour] = useState<string>('08:00');
  const [duration, setDuration] = useState<number>(0);
  const [raiNumber, setRaiNumber] = useState<string>('');

  const hourOptions = useMemo(() => generateHoursOptions(), []);
  const endHour = useMemo(() => calculateEndHour(startHour, duration), [startHour, duration]);
  const weekday = useMemo(() => getWeekdayName(date), [date]);
  
  const currentValue = useMemo(() => 
    calculateAC4Value(date, startHour, duration), 
  [date, startHour, duration]);

  const handleAdd = () => {
    if (!date || !startHour || duration === 0) return;

    const newRecord: WorkRecord = {
      id: crypto.randomUUID(),
      date,
      startHour,
      endHour,
      duration,
      value: currentValue,
      weekday: weekday,
      raiNumber: raiNumber.trim()
    };

    onAddRecord(newRecord);
    setRaiNumber('');
  };

  const totalValue = records.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="animate-fade-in space-y-3 w-full max-w-full">
      <div className="flex items-center space-x-3 mb-2 px-1">
        <div className="h-7 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
          Cálculo <span className="text-emerald-500">de Escala</span>
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-3 sm:p-5 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 px-1">Data de Início</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-[46px] px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900 dark:text-white font-medium text-sm"
                />
              </div>
              <p className="mt-1 text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] px-1 flex items-center">
                <i className="fas fa-calendar-day mr-2 opacity-70"></i>
                {weekday || "SELECIONE UMA DATA"}
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 px-1">Nº RAI</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={raiNumber}
                  onChange={(e) => setRaiNumber(e.target.value.toUpperCase())}
                  placeholder="OPCIONAL"
                  className="w-full pl-10 pr-4 h-[46px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white font-bold transition-colors text-sm"
                />
                <i className="fas fa-file-invoice absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 px-1 truncate">Hora Inicial</label>
              <div className="relative">
                <select 
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full pl-9 pr-2 h-[46px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none appearance-none text-slate-900 dark:text-white font-bold transition-colors text-sm"
                >
                  {hourOptions.map(h => <option key={h} value={h} className="text-slate-900 dark:text-white">{h}</option>)}
                </select>
                <i className="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-xs"></i>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 px-1 truncate">Duração (h)</label>
              <div className="flex items-center h-[46px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-colors">
                <button 
                  onClick={() => setDuration(prev => Math.max(0, prev - 1))}
                  className="w-10 h-full flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-slate-200 dark:active:bg-slate-800 transition-colors border-r border-slate-200 dark:border-slate-700"
                >
                  <i className="fas fa-minus text-xs"></i>
                </button>
                <div className="flex-1 relative h-full">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-full bg-transparent appearance-none text-center font-black text-slate-900 dark:text-white text-base outline-none cursor-pointer"
                  >
                    {Array.from({ length: 25 }, (_, i) => (
                      <option key={i} value={i} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => setDuration(prev => Math.min(24, prev + 1))}
                  className="w-10 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 active:bg-slate-200 dark:active:bg-slate-800 transition-colors border-l border-slate-200 dark:border-slate-700"
                >
                  <i className="fas fa-plus text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border-l-4 border-emerald-600 space-y-2 shadow-inner transition-colors overflow-hidden">
            <div className="flex justify-between items-center gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Período</span>
                <span className="text-blue-600 dark:text-blue-400 font-black text-sm sm:text-base tracking-tight truncate block">
                  {startHour} — {endHour}
                </span>
                {raiNumber && <span className="block text-[8px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter truncate">RAI: {raiNumber}</span>}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Valor</span>
                <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(currentValue)}</span>
              </div>
            </div>
          </div>

          <button onClick={handleAdd} className={`w-full font-black py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center uppercase tracking-widest text-xs ${duration === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} disabled={duration === 0}>
            <i className="fas fa-save mr-2"></i> Arquivar no Rascunho
          </button>
        </div>
      </div>

      {records.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-black text-slate-400 flex items-center uppercase text-[9px] tracking-widest">
              <i className="fas fa-list mr-2 text-blue-500"></i> Serviços Temporários
            </h3>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {records.map(record => (
                  <tr key={record.id} className="text-slate-700 dark:text-slate-200">
                    <td className="px-3 py-2.5">
                      <div className="font-black">{record.date.split('-').reverse().slice(0,2).join('/')}</div>
                      <div className="text-[8px] text-slate-400 uppercase">{record.weekday.substring(0,3)}</div>
                    </td>
                    <td className="px-3 py-2.5 flex items-center gap-3">
                      <div className="min-w-0">
                        <div className="font-bold truncate max-w-[80px] sm:max-w-none text-sm">{record.startHour}-{record.endHour}</div>
                        <div className="text-[10px] text-slate-400 truncate font-medium">{record.duration}h {record.raiNumber ? `| RAI: ${record.raiNumber}` : ''}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(record.value)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => onRemoveRecord(record.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <i className="fas fa-trash text-[10px]"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <button onClick={onPostToMonthly} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-lg transition-all shadow-md uppercase tracking-widest text-[9px]">
              Mover para Controle Mensal ({formatCurrency(totalValue)})
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 shadow-lg transition-colors">
        <h4 className="text-[9px] font-black text-blue-600 dark:text-blue-400 mb-3 flex items-center uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
          <i className="fas fa-info-circle mr-2"></i> Regulamentação AC4 - Art. 1º e 2º
        </h4>
        <div className="grid grid-cols-1 gap-2 text-[9px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <div>
               <span className="font-black text-blue-600 dark:text-blue-500 uppercase block mb-0.5">Escala Azul</span>
               <p>DIU: R$ 26,47 | NOT: R$ 29,80</p>
             </div>
             <i className="fas fa-circle text-[4px] text-blue-500"></i>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <div>
               <span className="font-black text-red-600 dark:text-red-500 uppercase block mb-0.5">Escala Vermelha</span>
               <p>DIU: R$ 36,41 | NOT: R$ 41,38</p>
             </div>
             <i className="fas fa-circle text-[4px] text-red-500"></i>
          </div>
          <p className="text-[8px] italic uppercase tracking-tighter text-slate-400 text-center mt-1">
            * Turnos noturnos são vinculados ao dia operacional de início.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorTab;
