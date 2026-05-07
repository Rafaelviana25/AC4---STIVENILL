
import React, { useState } from 'react';
import { WorkRecord } from '../types';
import { formatCurrency, MONTH_NAMES } from '../utils';

interface MonthlyReportTabProps {
  records: WorkRecord[];
  onDeleteRecord: (id: string) => void;
  onUpdateRecord: (record: WorkRecord) => void;
}

interface MonthGroup {
  monthYear: string; // "YYYY-MM"
  monthName: string;
  year: string;
  totalHours: number;
  totalValue: number;
  redScaleDiurnoHours: number;
  redScaleDiurnoValue: number;
  redScaleNoturnoHours: number;
  redScaleNoturnoValue: number;
  blueScaleDiurnoHours: number;
  blueScaleDiurnoValue: number;
  blueScaleNoturnoHours: number;
  blueScaleNoturnoValue: number;
  count: number;
  items: WorkRecord[];
}

const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ records, onDeleteRecord, onUpdateRecord }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [editingRaiId, setEditingRaiId] = useState<string | null>(null);
  const [tempRai, setTempRai] = useState<string>('');
  
  const years = React.useMemo(() => {
    const y = new Set<string>(records.map(r => r.date.split('-')[0]));
    return Array.from(y).sort((a, b) => parseInt(b) - parseInt(a));
  }, [records]);

  const [selectedYear, setSelectedYear] = useState<string>(years[0] || new Date().getFullYear().toString());

  const monthlyData = React.useMemo(() => {
    const groups: Record<string, MonthGroup> = {};

    records.filter(r => r.date.startsWith(selectedYear)).forEach(r => {
      const [year, month] = r.date.split('-');
      const key = `${year}-${month}`;
      
      if (!groups[key]) {
        groups[key] = {
          monthYear: key,
          monthName: MONTH_NAMES[parseInt(month) - 1],
          year,
          totalHours: 0,
          totalValue: 0,
          redScaleDiurnoHours: 0,
          redScaleDiurnoValue: 0,
          redScaleNoturnoHours: 0,
          redScaleNoturnoValue: 0,
          blueScaleDiurnoHours: 0,
          blueScaleDiurnoValue: 0,
          blueScaleNoturnoHours: 0,
          blueScaleNoturnoValue: 0,
          count: 0,
          items: []
        };
      }
      
      // Calculate breakdown
      let currentDateTime = new Date(r.date + 'T' + r.startHour);
      
      for (let i = 0; i < r.duration; i++) {
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
          if (isNight) {
            groups[key].redScaleNoturnoHours += 1;
            groups[key].redScaleNoturnoValue += rate;
          } else {
            groups[key].redScaleDiurnoHours += 1;
            groups[key].redScaleDiurnoValue += rate;
          }
        } else {
          if (isNight) {
            groups[key].blueScaleNoturnoHours += 1;
            groups[key].blueScaleNoturnoValue += rate;
          } else {
            groups[key].blueScaleDiurnoHours += 1;
            groups[key].blueScaleDiurnoValue += rate;
          }
        }
        
        currentDateTime.setHours(currentDateTime.getHours() + 1);
      }

      groups[key].totalHours += r.duration;
      groups[key].totalValue += r.value;
      groups[key].count += 1;
      groups[key].items.push(r);
    });

    return Object.values(groups).sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  }, [records, selectedYear]);

  const startEditRai = (record: WorkRecord) => {
    setEditingRaiId(record.id);
    setTempRai(record.raiNumber || '');
  };

  const saveRai = (record: WorkRecord) => {
    onUpdateRecord({ ...record, raiNumber: tempRai.toUpperCase().trim() });
    setEditingRaiId(null);
  };

  if (records.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-white dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <i className="fas fa-folder-open text-slate-300 dark:text-slate-700 text-3xl"></i>
        </div>
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-sm">Sem Dados Históricos</h3>
          <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">Envie os rascunhos da calculadora para este controle.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4 pb-10">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-1 bg-gradient-to-b from-lime-400 to-green-600 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
          <h2 className="text-lg font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg">
            Controle <span className="text-lime-400">Mensal</span>
          </h2>
        </div>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-[#020617]/50 border border-white/5 rounded-lg px-3 py-1 text-slate-300 font-black text-xs outline-none focus:ring-2 focus:ring-lime-500/50"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {monthlyData.map((item) => (
          <div key={item.monthYear} className="bg-[#0f172a]/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl overflow-hidden relative group transition-all hover:border-white/10 hover:shadow-lime-500/10">
            <div 
              className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center cursor-pointer transition-colors hover:bg-white/10"
              onClick={() => setExpandedMonth(expandedMonth === item.monthYear ? null : item.monthYear)}
            >
              <div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-0.5">Período Operacional</span>
                <h3 className="text-lg font-black text-slate-200 uppercase tracking-tight transition-colors drop-shadow-md">
                  {item.monthName} <span className="text-slate-500 font-medium">{item.year}</span>
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 transition-colors shadow-inner flex items-center justify-center">
                   <span className="text-[8px] font-bold text-lime-400 uppercase tracking-wider">
                     {item.count} {item.count === 1 ? 'Extra' : 'Extras'}
                   </span>
                </div>
                <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-transform duration-300 ${expandedMonth === item.monthYear ? 'rotate-180 bg-white/10' : ''}`}>
                  <i className="fas fa-chevron-down text-slate-500 text-[10px]"></i>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4 transition-colors">
              <div className="space-y-0.5">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Total de Horas</span>
                <div className="flex items-end space-x-1">
                  <span className="text-xl font-black text-slate-300 tracking-tighter transition-colors drop-shadow-sm">{item.totalHours}</span>
                  <span className="text-[8px] font-bold text-slate-500 mb-1">HORAS</span>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Valor Acumulado</span>
                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500 tracking-tighter transition-colors drop-shadow-sm">
                  {formatCurrency(item.totalValue)}
                </div>
              </div>
            </div>

            {expandedMonth === item.monthYear && (
              <div className="px-4 pb-4 border-t border-white/5 pt-3 bg-black/20 animate-fade-in transition-colors">
                <div className="col-span-2 grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-red-900/10 p-2 rounded-lg border border-red-500/10">
                    <span className="text-[7px] font-black text-red-400 uppercase tracking-widest block">Escala Vermelha</span>
                    <div className="text-[9px] font-bold text-red-200">
                      Diurno: {item.redScaleDiurnoHours}H ({formatCurrency(item.redScaleDiurnoValue)})
                    </div>
                    <div className="text-[9px] font-bold text-red-200">
                      Noturno: {item.redScaleNoturnoHours}H ({formatCurrency(item.redScaleNoturnoValue)})
                    </div>
                  </div>
                  <div className="bg-blue-900/10 p-2 rounded-lg border border-blue-500/10">
                    <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest block">Escala Azul</span>
                    <div className="text-[9px] font-bold text-blue-200">
                      Diurno: {item.blueScaleDiurnoHours}H ({formatCurrency(item.blueScaleDiurnoValue)})
                    </div>
                    <div className="text-[9px] font-bold text-blue-200">
                      Noturno: {item.blueScaleNoturnoHours}H ({formatCurrency(item.blueScaleNoturnoValue)})
                    </div>
                  </div>
                </div>

                <h4 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center">
                  <i className="fas fa-list-ul mr-1.5 text-lime-400"></i> Detalhamento dos Turnos
                </h4>
                <div className="space-y-2">
                  {item.items.map(record => (
                    <div key={record.id} className="flex flex-col bg-white/5 p-3 rounded-xl border border-white/5 group/item transition-all hover:bg-white/10 hover:border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-center w-10 bg-white/5 rounded-lg py-1.5 border border-white/5">
                            <div className="text-xs font-black text-slate-200 leading-none">{record.date.split('-')[2]}</div>
                            <div className="text-[7px] font-bold text-slate-500 uppercase mt-0.5">{record.weekday.substring(0,3)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs font-black text-slate-300 uppercase tracking-tighter transition-colors">{record.startHour} - {record.endHour}</div>
                            <div className="text-[8px] font-bold text-slate-500 uppercase flex items-center space-x-1.5 mt-0.5">
                              <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">{record.duration}H</span>
                              {editingRaiId === record.id ? (
                                <div className="flex items-center space-x-1 bg-slate-800 rounded p-0.5 border border-slate-500/50">
                                  <input 
                                    type="text" 
                                    className="w-16 bg-transparent text-[8px] font-black outline-none text-white uppercase px-1"
                                    value={tempRai}
                                    autoFocus
                                    onChange={(e) => setTempRai(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveRai(record)}
                                  />
                                  <button onClick={() => saveRai(record)} className="text-lime-400 hover:text-lime-300 px-1">
                                    <i className="fas fa-check text-[8px]"></i>
                                  </button>
                                  <button onClick={() => setEditingRaiId(null)} className="text-slate-500 hover:text-slate-300 px-1">
                                    <i className="fas fa-times text-[8px]"></i>
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => startEditRai(record)}
                                  className="hover:text-lime-400 transition-colors flex items-center space-x-1 group/rai"
                                >
                                  <span>RAI: {record.raiNumber || '---'}</span>
                                  <i className="fas fa-pen text-[7px] opacity-0 group-hover/rai:opacity-100 transition-opacity ml-1 text-lime-400"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-xs font-black text-slate-300 transition-colors">{formatCurrency(record.value)}</div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteRecord(record.id); }}
                            className="text-slate-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                          >
                            <i className="fas fa-trash-alt text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-1 w-full bg-slate-900/50 transition-colors">
              <div 
                className="h-full bg-gradient-to-r from-lime-600 via-lime-500 to-green-400 shadow-[0_0_10px_rgba(163,230,53,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (item.totalHours / 160) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 border-dashed transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-blue-600/5 pointer-events-none"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-0.5">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Carga Horária Total ({selectedYear})</span>
             <p className="text-lg font-black text-slate-200 transition-colors">
               {records.filter(r => r.date.startsWith(selectedYear)).reduce((a,c) => a+c.duration, 0)}H
             </p>
          </div>
          <div className="text-right space-y-0.5">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Montante Anual ({selectedYear})</span>
             <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-blue-500 transition-colors drop-shadow-sm">
               {formatCurrency(records.filter(r => r.date.startsWith(selectedYear)).reduce((a,c) => a+c.value, 0))}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportTab;
