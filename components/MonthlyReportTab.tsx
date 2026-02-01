
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
  count: number;
  items: WorkRecord[];
}

const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({ records, onDeleteRecord, onUpdateRecord }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [editingRaiId, setEditingRaiId] = useState<string | null>(null);
  const [tempRai, setTempRai] = useState<string>('');

  const monthlyData = React.useMemo(() => {
    const groups: Record<string, MonthGroup> = {};

    records.forEach(r => {
      const [year, month] = r.date.split('-');
      const key = `${year}-${month}`;
      
      if (!groups[key]) {
        groups[key] = {
          monthYear: key,
          monthName: MONTH_NAMES[parseInt(month) - 1],
          year,
          totalHours: 0,
          totalValue: 0,
          count: 0,
          items: []
        };
      }
      
      groups[key].totalHours += r.duration;
      groups[key].totalValue += r.value;
      groups[key].count += 1;
      groups[key].items.push(r);
    });

    return Object.values(groups).sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  }, [records]);

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
    <div className="animate-fade-in space-y-3">
      <div className="flex items-center space-x-3 mb-4 px-2">
        <div className="h-8 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
          Controle <span className="text-emerald-500">Mensal</span>
        </h2>
      </div>

      <div className="grid gap-4">
        {monthlyData.map((item) => (
          <div key={item.monthYear} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl overflow-hidden relative group transition-all hover:border-emerald-500/50">
            <div 
              className="bg-slate-50/80 dark:bg-slate-900/80 px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer transition-colors"
              onClick={() => setExpandedMonth(expandedMonth === item.monthYear ? null : item.monthYear)}
            >
              <div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] block mb-1">Período Operacional</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight transition-colors">
                  {item.monthName} <span className="text-slate-400 dark:text-slate-500 font-medium">{item.year}</span>
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                   <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{item.count} EXTRAS</span>
                </div>
                <i className={`fas fa-chevron-${expandedMonth === item.monthYear ? 'up' : 'down'} text-slate-400 text-xs`}></i>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4 transition-colors">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Total de Horas</span>
                <div className="flex items-end space-x-1">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter transition-colors">{item.totalHours}</span>
                  <span className="text-[10px] font-bold text-slate-400 mb-1">HORAS</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Valor Acumulado</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter transition-colors">
                  {formatCurrency(item.totalValue)}
                </div>
              </div>
            </div>

            {expandedMonth === item.monthYear && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700/50 pt-4 bg-slate-50/50 dark:bg-slate-900/30 animate-fade-in transition-colors">
                <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Detalhamento dos Turnos</h4>
                <div className="space-y-3">
                  {item.items.map(record => (
                    <div key={record.id} className="flex flex-col bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700 group/item transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-center w-10">
                            <div className="text-xs font-black text-slate-900 dark:text-white leading-none">{record.date.split('-')[2]}</div>
                            <div className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">{record.weekday.substring(0,3)}</div>
                          </div>
                          
                          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                          <div>
                            <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter transition-colors">{record.startHour} - {record.endHour}</div>
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center space-x-1">
                              <span>{record.duration}H</span>
                              <span>•</span>
                              {editingRaiId === record.id ? (
                                <div className="flex items-center space-x-1">
                                  <input 
                                    type="text" 
                                    className="w-20 bg-slate-100 dark:bg-slate-800 text-[9px] font-black border border-emerald-500 rounded px-1 outline-none text-slate-900 dark:text-white"
                                    value={tempRai}
                                    autoFocus
                                    onChange={(e) => setTempRai(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveRai(record)}
                                  />
                                  <button onClick={() => saveRai(record)} className="text-emerald-500 hover:text-emerald-600">
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button onClick={() => setEditingRaiId(null)} className="text-slate-400">
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => startEditRai(record)}
                                  className="hover:text-emerald-500 transition-colors flex items-center space-x-1 group/rai"
                                >
                                  <span>RAI: {record.raiNumber || '---'}</span>
                                  <i className="fas fa-pen text-[7px] opacity-0 group-hover/rai:opacity-100 transition-opacity"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 transition-colors">{formatCurrency(record.value)}</div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteRecord(record.id); }}
                            className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors p-2"
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-1 w-full bg-slate-100 dark:bg-slate-900 transition-colors">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500"
                style={{ width: `${Math.min(100, (item.totalHours / 160) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 border-dashed transition-colors">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Carga Horária Total</span>
             <p className="text-xl font-black text-slate-700 dark:text-slate-300 transition-colors">{records.reduce((a,c) => a+c.duration, 0)}H</p>
          </div>
          <div className="text-right space-y-1">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Montante Histórico</span>
             <p className="text-xl font-black text-emerald-600 dark:text-emerald-500 transition-colors">{formatCurrency(records.reduce((a,c) => a+c.value, 0))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportTab;
