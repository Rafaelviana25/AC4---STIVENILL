import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorTab from './components/CalculatorTab';
import MonthlyReportTab from './components/MonthlyReportTab';
import ProfileTab from './components/ProfileTab';
import Toast from './components/Toast';
import { WorkRecord } from './types';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [draftRecords, setDraftRecords] = useState<WorkRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<WorkRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'report' | 'profile'>('calc');
  const [theme] = useState<'dark' | 'light'>('dark'); 
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const initStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: false });
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#020617' });
        } catch (e) {
          console.warn('StatusBar not available', e);
        }
      }
    };
    initStatusBar();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setIsKeyboardOpen(window.visualViewport.height < window.innerHeight * 0.85);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && !['range', 'checkbox', 'radio', 'button', 'submit', 'reset', 'color', 'file', 'image'].includes((target as HTMLInputElement).type)))) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    const userPrefix = `ac4_local_`;
    const savedMonthly = localStorage.getItem(userPrefix + 'monthly_records') || localStorage.getItem('ac4_monthly_records');
    const savedDrafts = localStorage.getItem(userPrefix + 'draft_records') || localStorage.getItem('ac4_draft_records');

    if (savedMonthly) try { setMonthlyRecords(JSON.parse(savedMonthly)); } catch (e) {}
    else setMonthlyRecords([]);

    if (savedDrafts) try { setDraftRecords(JSON.parse(savedDrafts)); } catch (e) {}
    else setDraftRecords([]);
    
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const userPrefix = `ac4_local_`;
    
    localStorage.setItem(userPrefix + 'monthly_records', JSON.stringify(monthlyRecords));
    localStorage.setItem(userPrefix + 'draft_records', JSON.stringify(draftRecords));
  }, [monthlyRecords, draftRecords]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ message, type });

  const handleRestoreBackup = (data: any) => {
    const userPrefix = `ac4_local_`;

    try {
      if (data.monthly_records) {
        localStorage.setItem(userPrefix + 'monthly_records', data.monthly_records);
        setMonthlyRecords(JSON.parse(data.monthly_records));
      }
      if (data.draft_records) {
        localStorage.setItem(userPrefix + 'draft_records', data.draft_records);
        setDraftRecords(JSON.parse(data.draft_records));
      }
      
      showToast('Backup restaurado com sucesso!', 'success');
    } catch (e) {
      console.error("Erro ao restaurar backup", e);
      showToast('Erro ao restaurar backup', 'error');
    }
  };

  const handleUpdateMonthlyRecord = (record: WorkRecord) => {
    setMonthlyRecords(prev => prev.map(r => r.id === record.id ? record : r));
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6"
        style={{ paddingTop: 'var(--sat)' }}
      >
        <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-10"></div>
        
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span className="text-lime-500 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]">AC4</span>
          <span className="text-white opacity-40">-</span>
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">STIVENILL</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#172554] pb-24 text-slate-200 font-sans selection:bg-lime-400 selection:text-slate-900 overflow-x-hidden">
        <Header theme={theme} />
        
        <main 
          className="container mx-auto max-w-lg w-full px-4"
          style={{ paddingTop: 'calc(4rem + var(--sat))' }}
        >
          {activeTab === 'calc' && (
            <CalculatorTab 
              records={draftRecords} 
              onAddRecord={(r) => { 
                setDraftRecords([...draftRecords, r]); 
              }}
              onRemoveRecord={(id) => setDraftRecords(draftRecords.filter(r => r.id !== id))}
              onExportPDF={() => {}}
              onCopyAll={() => {}}
              onPostToMonthly={() => { 
                setMonthlyRecords([...monthlyRecords, ...draftRecords]); 
                setDraftRecords([]); 
                setActiveTab('report'); 
              }}
            />
          )}
          {activeTab === 'report' && (
            <MonthlyReportTab 
              records={monthlyRecords} 
              onDeleteRecord={(id) => setMonthlyRecords(monthlyRecords.filter(r => r.id !== id))}
              onUpdateRecord={handleUpdateMonthlyRecord}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab 
              userPrefix={`ac4_local_`}
              session={null}
              onRestore={handleRestoreBackup}
              onShowToast={showToast}
              monthlyRecords={monthlyRecords}
            />
          )}
        </main>

        {!isKeyboardOpen && (
          <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around py-4 z-[100] animate-fade-in shadow-[0_-5px_20px_rgba(0,0,0,0.8)] h-[70.2px]">
            <button 
              onClick={() => setActiveTab('calc')} 
              className={`relative flex flex-col items-center justify-center p-1 transition-all duration-300 group ${activeTab === 'calc' ? 'text-lime-400 -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`absolute inset-0 bg-lime-500/10 blur-xl rounded-full transition-opacity duration-300 ${activeTab === 'calc' ? 'opacity-100' : 'opacity-0'}`}></div>
              <i className={`fas fa-calculator relative z-10 ${activeTab === 'calc' ? 'text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-lg'}`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1.5 relative z-10">Cálculo</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('report')} 
              className={`relative flex flex-col items-center justify-center p-1 transition-all duration-300 group ${activeTab === 'report' ? 'text-lime-400 -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`absolute inset-0 bg-lime-500/10 blur-xl rounded-full transition-opacity duration-300 ${activeTab === 'report' ? 'opacity-100' : 'opacity-0'}`}></div>
              <i className={`fas fa-chart-pie relative z-10 ${activeTab === 'report' ? 'text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-lg'}`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1.5 relative z-10">Controle</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')} 
              className={`relative flex flex-col items-center justify-center p-1 transition-all duration-300 group ${activeTab === 'profile' ? 'text-lime-400 -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`absolute inset-0 bg-lime-500/10 blur-xl rounded-full transition-opacity duration-300 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0'}`}></div>
              <i className={`fas fa-user relative z-10 ${activeTab === 'profile' ? 'text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]' : 'text-lg'}`}></i>
              <span className="text-[10px] font-black uppercase tracking-widest mt-1.5 relative z-10">Perfil</span>
            </button>
          </nav>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
};

export default App;
