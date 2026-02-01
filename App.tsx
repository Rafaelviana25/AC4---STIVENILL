
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorTab from './components/CalculatorTab';
import MonthlyReportTab from './components/MonthlyReportTab';
import CalendarTab from './components/CalendarTab';
import Toast from './components/Toast';
import { WorkRecord, CalendarEvent, ShiftType } from './types';
import { DEFAULT_SHIFT_TYPES } from './constants';

const App: React.FC = () => {
  const [draftRecords, setDraftRecords] = useState<WorkRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<WorkRecord[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  // Define 'agenda' como a aba inicial
  const [activeTab, setActiveTab] = useState<'calc' | 'report' | 'agenda'>('agenda');
  const [theme] = useState<'dark' | 'light'>('dark'); 
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const savedMonthly = localStorage.getItem('ac4_monthly_records');
    const savedDrafts = localStorage.getItem('ac4_draft_records');
    const savedEvents = localStorage.getItem('ac4_calendar_events');
    const savedShifts = localStorage.getItem('ac4_shift_types');
    
    if (savedMonthly) try { setMonthlyRecords(JSON.parse(savedMonthly)); } catch (e) {}
    if (savedDrafts) try { setDraftRecords(JSON.parse(savedDrafts)); } catch (e) {}
    
    if (savedEvents) {
      try { 
        let events = JSON.parse(savedEvents);
        events = events.map((e: any) => {
          if (e.shiftTypeId && !e.shiftTypeIds) {
            return { ...e, shiftTypeIds: [e.shiftTypeId] };
          }
          return e;
        });
        setCalendarEvents(events);
      } catch (e) {}
    }
    
    if (savedShifts) {
      try { 
        let parsed = JSON.parse(savedShifts);
        if (!parsed.find((s: ShiftType) => s.id === 'extra_ac4')) {
          const extraShift = DEFAULT_SHIFT_TYPES.find(s => s.id === 'extra_ac4');
          if (extraShift) parsed.push(extraShift);
        }
        setShiftTypes(parsed); 
      } catch (e) { setShiftTypes(DEFAULT_SHIFT_TYPES); }
    } else {
      setShiftTypes(DEFAULT_SHIFT_TYPES);
    }
    
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('ac4_monthly_records', JSON.stringify(monthlyRecords));
    localStorage.setItem('ac4_draft_records', JSON.stringify(draftRecords));
    localStorage.setItem('ac4_calendar_events', JSON.stringify(calendarEvents));
    localStorage.setItem('ac4_shift_types', JSON.stringify(shiftTypes));
  }, [monthlyRecords, draftRecords, calendarEvents, shiftTypes]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ message, type });

  const handleSaveCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => {
      const filtered = prev.filter(e => e.date !== event.date);
      if (event.shiftTypeIds.length === 0 && !event.observation) return filtered;
      return [...filtered, event];
    });
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleAddShiftType = (shift: ShiftType) => {
    setShiftTypes(prev => {
      const exists = prev.some(s => s.id === shift.id);
      if (exists) {
        return prev.map(s => s.id === shift.id ? shift : s);
      }
      return [...prev, shift];
    });
    
    const isUpdate = shiftTypes.some(s => s.id === shift.id);
    showToast(isUpdate ? "Turno atualizado!" : "Turno criado!");
  };

  const handleDeleteShiftType = (id: string) => {
    setShiftTypes(prev => prev.filter(s => s.id !== id));
    showToast("Turno removido");
  };

  const handleUpdateMonthlyRecord = (record: WorkRecord) => {
    setMonthlyRecords(prev => prev.map(r => r.id === record.id ? record : r));
    showToast("RAI atualizado!");
  };

  return (
    <>
      <div className="min-h-screen bg-[#020617] pb-20 transition-colors duration-500 overflow-x-hidden">
        <Header theme={theme} />
        
        <main className={`container mx-auto max-w-lg transition-all duration-300 w-full ${
          activeTab === 'agenda' ? 'pt-24' : 'pt-20 px-4'
        }`}>
          {activeTab === 'calc' && (
            <CalculatorTab 
              records={draftRecords} 
              onAddRecord={(r) => { 
                setDraftRecords([...draftRecords, r]); 
                const existing = calendarEvents.find(e => e.date === r.date);
                let currentIds = existing ? [...existing.shiftTypeIds] : [];
                if (!currentIds.includes('extra_ac4')) {
                  if (currentIds.length >= 2) {
                    currentIds[1] = 'extra_ac4';
                  } else {
                    currentIds.push('extra_ac4');
                  }
                }
                const extraEvent: CalendarEvent = {
                  id: existing?.id || crypto.randomUUID(),
                  date: r.date,
                  shiftTypeIds: currentIds,
                  observation: existing?.observation || '' 
                };
                handleSaveCalendarEvent(extraEvent);
                showToast("Arquivado e Agenda atualizada!"); 
              }}
              onRemoveRecord={(id) => setDraftRecords(draftRecords.filter(r => r.id !== id))}
              onExportPDF={() => {}}
              onCopyAll={() => {}}
              onPostToMonthly={() => { setMonthlyRecords([...monthlyRecords, ...draftRecords]); setDraftRecords([]); setActiveTab('report'); }}
            />
          )}
          {activeTab === 'report' && (
            <MonthlyReportTab 
              records={monthlyRecords} 
              onDeleteRecord={(id) => setMonthlyRecords(monthlyRecords.filter(r => r.id !== id))}
              onUpdateRecord={handleUpdateMonthlyRecord}
            />
          )}
          {activeTab === 'agenda' && (
            <CalendarTab 
              events={calendarEvents}
              shiftTypes={shiftTypes}
              onSaveEvent={handleSaveCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
              onAddShiftType={handleAddShiftType}
              onDeleteShiftType={handleDeleteShiftType}
            />
          )}
        </main>

        {/* Menu Inferior Fixo, Fino e Integrado à Base - Reordenado */}
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-stretch py-1.5 z-[100] animate-fade-in overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          {/* 1º Agenda */}
          <button 
            onClick={() => setActiveTab('agenda')} 
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${activeTab === 'agenda' ? 'text-indigo-400 scale-105' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <i className={`fas fa-calendar-alt ${activeTab === 'agenda' ? 'text-lg' : 'text-base'}`}></i>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Agenda</span>
          </button>

          {/* 2º Cálculo */}
          <button 
            onClick={() => setActiveTab('calc')} 
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${activeTab === 'calc' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <i className={`fas fa-calculator ${activeTab === 'calc' ? 'text-lg' : 'text-base'}`}></i>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Cálculo</span>
          </button>
          
          {/* 3º Mensal */}
          <button 
            onClick={() => setActiveTab('report')} 
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-300 ${activeTab === 'report' ? 'text-emerald-500 scale-105' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <i className={`fas fa-chart-line ${activeTab === 'report' ? 'text-lg' : 'text-base'}`}></i>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Mensal</span>
          </button>
        </nav>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
};

export default App;
