
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
    <div className="animate-fade-in space-y-4 w-full max-w-full pb-10">
      <div className="flex items-center space-x-2 mb-1 px-1">
        <div className="h-6 w-1 bg-gradient-to-b from-lime-400 to-green-600 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
        <h2 className="text-lg font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg">
          Cálculo <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-blue-500">de Escala</span>
        </h2>
      </div>

      <div className="bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/5 text-slate-200 transition-all hover:border-white/10">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1 group-focus-within:text-lime-400 transition-colors">Data de Início</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 bg-[#020617]/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none transition-all text-slate-200 font-medium text-xs shadow-inner"
                />
              </div>
              <p className="mt-1 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center">
                <i className="fas fa-calendar-day mr-1.5 opacity-70"></i>
                {weekday || "SELECIONE UMA DATA"}
              </p>
            </div>

            <div className="group">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1 group-focus-within:text-lime-400 transition-colors">Nº RAI</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={raiNumber}
                  onChange={(e) => setRaiNumber(e.target.value.toUpperCase())}
                  placeholder="OPCIONAL"
                  className="w-full pl-9 pr-3 h-10 bg-[#020617]/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none text-slate-200 font-bold transition-all text-xs shadow-inner placeholder-slate-700"
                />
                <i className="fas fa-file-invoice absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] group-focus-within:text-lime-400 transition-colors"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1 truncate group-focus-within:text-lime-400 transition-colors">Hora Inicial</label>
              <div className="relative">
                <select 
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full pl-9 pr-3 h-10 bg-[#020617]/50 border border-white/5 rounded-xl focus:ring-2 focus:ring-lime-500/50 focus:border-transparent outline-none appearance-none text-slate-200 font-bold transition-all text-xs shadow-inner"
                >
                  {hourOptions.map(h => <option key={h} value={h} className="text-slate-300 bg-slate-900">{h}</option>)}
                </select>
                <i className="fas fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] group-focus-within:text-lime-400 transition-colors"></i>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-[8px] pointer-events-none"></i>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1 truncate">Duração (h)</label>
              <div className="flex items-center h-10 bg-[#020617]/50 border border-white/5 rounded-xl overflow-hidden transition-all shadow-inner group focus-within:ring-2 focus-within:ring-lime-500/50">
                <button 
                  onClick={() => setDuration(prev => Math.max(0, prev - 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-800 active:bg-slate-700 transition-colors border-r border-white/5 hover:text-lime-400"
                >
                  <i className="fas fa-minus text-[10px]"></i>
                </button>
                <div className="flex-1 relative h-full">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-full bg-transparent appearance-none text-center font-black text-slate-200 text-sm outline-none cursor-pointer"
                  >
                    {Array.from({ length: 25 }, (_, i) => (
                      <option key={i} value={i} className="text-slate-300 bg-slate-900">
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => setDuration(prev => Math.min(24, prev + 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-400 hover:bg-slate-800 active:bg-slate-700 transition-colors border-l border-white/5 hover:text-lime-400"
                >
                  <i className="fas fa-plus text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-3 border border-white/5 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-lime-500 to-green-600"></div>
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-lime-500/5 rounded-full blur-2xl group-hover:bg-lime-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-center gap-3 relative z-10">
              <div className="min-w-0 flex-1">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Período</span>
                <span className="text-slate-200 font-black text-sm tracking-tight truncate block drop-shadow-md">
                  {startHour} — {endHour}
                </span>
                {raiNumber && <span className="block text-[8px] font-black text-slate-400 uppercase mt-0.5 tracking-wider truncate">RAI: {raiNumber}</span>}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Valor Estimado</span>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 drop-shadow-sm">{formatCurrency(currentValue)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAdd} 
            className={`w-full font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center uppercase tracking-widest text-[10px] relative overflow-hidden group ${duration === 0 ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-lime-600 to-green-600 text-white hover:shadow-lime-500/20 border border-white/10'}`} 
            disabled={duration === 0}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <i className="fas fa-save mr-2 relative z-10"></i> <span className="relative z-10">Arquivar no Rascunho</span>
          </button>
        </div>
      </div>

      {records.length > 0 && (
        <div className="bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/5 transition-all">
          <div className="bg-white/5 p-3 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-black text-slate-300 flex items-center uppercase text-[9px] tracking-widest">
              <i className="fas fa-list mr-1.5 text-lime-400"></i> Serviços Temporários
            </h3>
            <span className="bg-lime-500/20 text-lime-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-lime-500/30">{records.length}</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-[10px]">
              <tbody className="divide-y divide-white/5">
                {records.map(record => (
                  <tr key={record.id} className="text-slate-300 hover:bg-white/5 transition-colors group">
                    <td className="px-3 py-2">
                      <div className="font-black text-slate-200">{record.date.split('-').reverse().slice(0,2).join('/')}</div>
                      <div className="text-[8px] text-slate-500 uppercase font-bold">{record.weekday.substring(0,3)}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="min-w-0">
                        <div className="font-bold truncate max-w-[80px] sm:max-w-none text-xs text-slate-200">{record.startHour}-{record.endHour}</div>
                        <div className="text-[9px] text-slate-500 truncate font-medium flex items-center gap-1">
                          <span className="text-slate-400 font-bold">{record.duration}h</span> 
                          {record.raiNumber && <span className="bg-slate-800 px-1 rounded text-[7px] border border-white/5">{record.raiNumber}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-black text-slate-300">
                      {formatCurrency(record.value)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => onRemoveRecord(record.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                        <i className="fas fa-trash text-[9px]"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-white/5 border-t border-white/5">
            <button onClick={onPostToMonthly} className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white font-black py-2.5 rounded-xl transition-all shadow-lg shadow-lime-900/20 uppercase tracking-widest text-[9px] active:scale-95 border border-white/10">
              Mover para Controle Mensal ({formatCurrency(totalValue)})
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#0f172a]/50 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
        <h4 className="text-[8px] font-black text-slate-400 mb-3 flex items-center uppercase tracking-widest border-b border-white/5 pb-1.5">
          <i className="fas fa-info-circle mr-1.5 text-blue-400"></i> Regulamentação AC4 - Art. 1º e 2º
        </h4>
        <div className="grid grid-cols-1 gap-2 text-[9px] text-slate-500 font-medium leading-relaxed">
          <div className="bg-blue-900/10 p-2.5 rounded-xl border border-blue-500/10 flex justify-between items-center hover:bg-blue-900/20 transition-colors">
             <div>
               <span className="font-black text-blue-400 uppercase block mb-0.5 tracking-wide">Escala Azul</span>
               <p className="opacity-80 text-slate-400">DIU: R$ 26,47 | NOT: R$ 29,80</p>
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          </div>
          <div className="bg-red-900/10 p-2.5 rounded-xl border border-red-500/10 flex justify-between items-center hover:bg-red-900/20 transition-colors">
             <div>
               <span className="font-black text-red-400 uppercase block mb-0.5 tracking-wide">Escala Vermelha</span>
               <p className="opacity-80 text-slate-400">DIU: R$ 36,41 | NOT: R$ 41,38</p>
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          </div>
          <p className="text-[8px] italic uppercase tracking-wide text-slate-600 text-center mt-1">
            * Turnos noturnos são vinculados ao dia operacional de início.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculatorTab;
