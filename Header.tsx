import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CalendarEvent, ShiftType } from '../types';
import { MONTH_NAMES, HOLIDAYS } from '../constants';
import { TacticalColorPicker } from './TacticalColorPicker';

interface CalendarTabProps {
  events: CalendarEvent[];
  shiftTypes: ShiftType[];
  onSaveEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddShiftType: (shift: ShiftType) => void;
  onDeleteShiftType: (id: string) => void;
  onUpdateShiftType?: (shift: ShiftType) => void;
}

type Mode = 'PINTAR' | 'EDITAR' | 'TURNOS';

const INITIAL_BG_COLORS = ['#22C55E', '#15803D', '#059669', '#0EA5E9', '#0369A1', '#1E40AF', '#E6007E', '#003366', '#F97316'];
const INITIAL_TEXT_COLORS = ['#000000', '#1E293B', '#475569', '#94A3B8', '#CBD5E1', '#FFFFFF'];

const CalendarTab: React.FC<CalendarTabProps> = ({ 
  events, 
  shiftTypes, 
  onSaveEvent, 
  onAddShiftType,
  onDeleteShiftType,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState<Mode>('PINTAR');
  const [selectedHolidayInfo, setSelectedHolidayInfo] = useState<string | null>(null);
  
  const [favoriteBgColors, setFavoriteBgColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('ac4_fav_bg_colors');
    return saved ? JSON.parse(saved) : INITIAL_BG_COLORS;
  });

  const [favoriteTextColors, setFavoriteTextColors] = useState<string[]>(() => {
    const saved = localStorage.getItem('ac4_fav_text_colors');
    return saved ? JSON.parse(saved) : INITIAL_TEXT_COLORS;
  });

  const [activeShiftId, setActiveShiftId] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);
  const [isConfiguringShift, setIsConfiguringShift] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<{ field: 'color' | 'textColor' | 'override_bg' | 'override_text', shiftId?: string } | null>(null);

  const [configShift, setConfigShift] = useState<Partial<ShiftType>>({
    name: '',
    label: 'NOVO',
    color: '#059669',
    textColor: '#ffffff',
    fontSize: 10,
    showTime: false
  });

  const visibleShiftTypes = useMemo(() => shiftTypes.filter(s => s.id !== 'extra_ac4'), [shiftTypes]);

  useEffect(() => {
    if (selectedHolidayInfo) {
      const timer = setTimeout(() => {
        setSelectedHolidayInfo(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedHolidayInfo]);

  useEffect(() => {
    if (!activeShiftId && visibleShiftTypes.length > 0) {
        setActiveShiftId(visibleShiftTypes[0].id);
    }
  }, [visibleShiftTypes, activeShiftId]);

  useEffect(() => {
    localStorage.setItem('ac4_fav_bg_colors', JSON.stringify(favoriteBgColors));
  }, [favoriteBgColors]);

  useEffect(() => {
    localStorage.setItem('ac4_fav_text_colors', JSON.stringify(favoriteTextColors));
  }, [favoriteTextColors]);

  const pushToFavorites = (color: string, isBackground: boolean) => {
    const normalized = color.toUpperCase();
    const setter = isBackground ? setFavoriteBgColors : setFavoriteTextColors;
    setter(prev => {
      const filtered = prev.filter(c => c.toUpperCase() !== normalized);
      return [normalized, ...filtered].slice(0, 20);
    });
  };

  const todayStr = useMemo(() => {
    const now = new Date();
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarGrid = useMemo(() => {
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, currentMonth: false, monthOffset: -1 });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true, monthOffset: 0 });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, monthOffset: 1 });
    }
    return days;
  }, [year, month, adjustedFirstDay, daysInMonth]);

  const handleDayClick = (dayObj: { day: number; currentMonth: boolean; monthOffset: number }) => {
    const d = new Date(year, month + dayObj.monthOffset, dayObj.day);
    const dateStr = d.toISOString().split('T')[0];
    const existing = events.find(e => e.date === dateStr);

    if (mode === 'PINTAR') {
      if (activeShiftId === 'eraser') {
        if (existing) onSaveEvent({ ...existing, shiftTypeIds: [], overrides: {} });
        return;
      }
      if (existing) {
        let newIds = [...existing.shiftTypeIds];
        if (newIds.includes(activeShiftId)) {
          newIds = newIds.filter(id => id !== activeShiftId);
        } else {
          if (newIds.length < 2) newIds.push(activeShiftId);
          else newIds[1] = activeShiftId;
        }
        onSaveEvent({ ...existing, shiftTypeIds: newIds });
      } else {
        onSaveEvent({ id: crypto.randomUUID(), date: dateStr, shiftTypeIds: [activeShiftId], observation: '' });
      }
    } else if (mode === 'EDITAR') {
      setEditingEvent(existing || { id: crypto.randomUUID(), date: dateStr, shiftTypeIds: [], observation: '', overrides: {} });
    }
  };

  const handleSaveShiftConfig = () => {
    const shiftData = {
      id: editingShiftId || crypto.randomUUID(),
      name: (configShift.label || 'TURNO').toUpperCase(),
      label: (configShift.label || 'NOVO').toUpperCase(),
      color: configShift.color || '#059669',
      textColor: configShift.textColor || '#ffffff',
      fontSize: Number(configShift.fontSize) || 10,
      showTime: false
    };
    onAddShiftType(shiftData as ShiftType);
    setIsConfiguringShift(false);
    setEditingShiftId(null);
  };

  const openEditShift = (shift: ShiftType) => {
    setEditingShiftId(shift.id);
    setConfigShift(shift);
    setIsConfiguringShift(true);
  };

  const getShiftWithOverrides = (id: string, event?: CalendarEvent) => {
    const baseShift = shiftTypes.find(s => s.id === id);
    if (!baseShift) return null;
    const override = event?.overrides?.[id];
    return override ? { ...baseShift, ...override } : baseShift;
  };

  const updateOverride = (shiftId: string, field: 'label' | 'color' | 'textColor', value: string) => {
    if (!editingEvent) return;
    const currentOverrides = editingEvent.overrides || {};
    const shiftOverride = currentOverrides[shiftId] || {};
    setEditingEvent({
      ...editingEvent,
      overrides: { ...currentOverrides, [shiftId]: { ...shiftOverride, [field]: field === 'label' ? value.toUpperCase() : value } }
    });
  };

  const shiftTextStyle = (s: Partial<ShiftType>) => {
    const size = Number(s.fontSize) || 10;
    return {
      color: s.textColor,
      fontSize: `${size}px`,
      lineHeight: '1.2',
      fontWeight: '900',
      textAlign: 'center' as const,
      fontStyle: 'normal',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: '2px'
    };
  };

  const shiftTextClasses = "text-center w-full h-full flex items-center justify-center whitespace-normal break-all overflow-hidden uppercase";
  const shiftSquareClasses = "w-12 h-12 shrink-0 flex items-center justify-center border border-black/10 overflow-hidden shadow-lg rounded-none transition-all";

  const ColorPaletteRow = ({ label, currentColor, onTriggerPicker, onSelectColor, favorites, isBg }: any) => (
    <div className="space-y-1">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block text-center">
        {label}
      </label>
      <div className="bg-[#020617] p-2 rounded-2xl border border-white/5 flex items-center gap-2 overflow-x-auto custom-scrollbar w-full shadow-inner">
        <button 
          onClick={onTriggerPicker}
          className="shrink-0 w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg active:scale-95 transition-all group hover:border-lime-500/50"
        >
          <i className="fas fa-palette text-slate-300 text-[10px] group-hover:text-lime-400 transition-colors"></i>
        </button>
        {favorites.map((c: string) => (
          <button 
            key={c} 
            onClick={() => onSelectColor(c)} 
            style={{ backgroundColor: c }} 
            className={`w-8 h-8 rounded-lg shrink-0 border border-white/5 flex items-center justify-center transition-all active:scale-90 ${currentColor?.toUpperCase() === c.toUpperCase() ? 'ring-2 ring-white scale-105 z-10 shadow-lg' : 'opacity-90 hover:opacity-100 hover:scale-105'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-1 pb-20 h-[608.5px]">
      {showPicker && (
        <TacticalColorPicker 
          color={
            showPicker.field === 'color' ? configShift.color! : 
            showPicker.field === 'textColor' ? configShift.textColor! :
            showPicker.field === 'override_bg' ? (getShiftWithOverrides(showPicker.shiftId!, editingEvent as CalendarEvent)?.color || '#000') :
            (getShiftWithOverrides(showPicker.shiftId!, editingEvent as CalendarEvent)?.textColor || '#fff')
          }
          previewConfig={isConfiguringShift ? {
            label: configShift.label || 'NOVO',
            bgColor: showPicker.field === 'color' ? (configShift.color || '#000') : (configShift.color || '#000'),
            textColor: showPicker.field === 'textColor' ? (configShift.textColor || '#fff') : (configShift.textColor || '#fff'),
            fontSize: configShift.fontSize || 10
          } : undefined}
          onClose={() => setShowPicker(null)}
          onChange={(newHex) => {
            if (showPicker.field === 'color') setConfigShift({...configShift, color: newHex});
            else if (showPicker.field === 'textColor') setConfigShift({...configShift, textColor: newHex});
            else if (showPicker.field === 'override_bg') updateOverride(showPicker.shiftId!, 'color', newHex);
            else if (showPicker.field === 'override_text') updateOverride(showPicker.shiftId!, 'textColor', newHex);
          }}
          onConfirm={(finalHex) => {
            const isBg = showPicker.field === 'color' || showPicker.field === 'override_bg';
            pushToFavorites(finalHex, isBg);
            setShowPicker(null);
          }}
        />
      )}

      <div className="flex items-center justify-start px-2 pt-1">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-1 bg-gradient-to-b from-lime-400 to-green-600 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
          <h2 className="text-base font-black text-slate-200 uppercase tracking-tighter drop-shadow-lg flex items-center gap-1">
            <span>Agenda</span>
            <span className="text-lime-400">Operacional</span>
          </h2>
        </div>
      </div>

      {selectedHolidayInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 pointer-events-none">
           <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl text-center max-w-[200px] w-auto animate-fade-in pointer-events-auto" onClick={() => setSelectedHolidayInfo(null)}>
              <p className="text-white font-black uppercase text-xs leading-tight drop-shadow-sm">{selectedHolidayInfo}</p>
           </div>
        </div>
      )}

      <div className="bg-[#0f172a]/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/5 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 to-blue-600/5 pointer-events-none"></div>
        
        <div className="p-3 flex items-center justify-between border-b border-white/5 relative z-10">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-500 hover:text-lime-400 hover:bg-white/10 transition-all active:scale-95">
            <i className="fas fa-chevron-left text-[10px]"></i>
          </button>
          <h3 className="text-base font-black text-slate-200 uppercase tracking-tight drop-shadow-md">
            {MONTH_NAMES[month]} <span className="text-slate-500">{year}</span>
          </h3>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-900/50 border border-white/5 flex items-center justify-center text-slate-500 hover:text-lime-400 hover:bg-white/10 transition-all active:scale-95">
            <i className="fas fa-chevron-right text-[10px]"></i>
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-700 bg-slate-900/30">
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => (
            <div key={d} className={`py-1.5 text-center text-[8px] font-semibold uppercase tracking-wider border-r border-slate-700 last:border-r-0 ${i === 5 || i === 6 ? 'text-lime-400' : 'text-slate-500'}`}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-slate-700 gap-px border-b border-slate-700">
          {calendarGrid.map((dayObj, i) => {
            const d = new Date(year, month + dayObj.monthOffset, dayObj.day);
            const dateStr = d.toISOString().split('T')[0];
            const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const holidayName = HOLIDAYS[dateStr] || HOLIDAYS[mmdd];
            
            const isToday = dateStr === todayStr;
            const event = events.find(e => e.date === dateStr);
            const shifts = event ? event.shiftTypeIds.map(id => getShiftWithOverrides(id, event)).filter(Boolean) as ShiftType[] : [];
            const isWeekend = i % 7 === 5 || i % 7 === 6;

            return (
              <button 
                key={`${dayObj.monthOffset}-${dayObj.day}`} 
                onClick={() => handleDayClick(dayObj)}
                className={`
                  min-h-[55px] relative transition-all group/cell hover:bg-slate-800/80 flex flex-col justify-between overflow-hidden
                  ${!dayObj.currentMonth 
                      ? 'bg-slate-800/60' 
                      : holidayName && shifts.length === 0
                          ? 'bg-slate-600'
                          : isWeekend 
                              ? 'bg-lime-400' 
                              : 'bg-slate-400'}
                  ${isToday && shifts.length === 0 ? 'bg-lime-500/20 shadow-inner ring-1 ring-lime-500/50 animate-pulse' : ''}
                `}
              >
                {/* Background Layer for Shifts */}
                {shifts.length > 0 && (
                  <div className="absolute inset-0 z-0 flex flex-col h-full w-full">
                    {shifts.map((s, idx) => (
                      <div key={idx} style={{ backgroundColor: s.color }} className="flex-1 w-full opacity-90"></div>
                    ))}
                  </div>
                )}

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full justify-between w-full p-0.5">
                  <div className="flex justify-between items-start w-full">
                    <span className={`
                      text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full
                      ${shifts.length > 0 
                          ? 'bg-black/20 text-white shadow-sm' 
                          : isToday 
                            ? 'bg-lime-500 text-slate-900 shadow-[0_0_10px_rgba(163,230,53,0.8)]' 
                            : !dayObj.currentMonth 
                              ? 'text-slate-500' 
                              : isWeekend 
                                ? 'text-black' 
                                : 'text-black'}
                    `}>
                      {dayObj.day}
                    </span>
                  </div>

                  {/* Shift Labels Centered */}
                  {shifts.length > 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                      {shifts.map((s, idx) => (
                        <span key={idx} style={{ color: s.textColor, fontSize: `${s.fontSize || 10}px` }} className="font-black uppercase leading-none drop-shadow-md text-center w-full break-all px-0.5">
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {event?.observation && (
                    <div className="w-full flex justify-center my-auto relative z-30">
                      <div className={`w-1 h-1 rounded-full ${shifts.length > 0 ? 'bg-white/80 shadow-sm' : 'bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]'}`}></div>
                    </div>
                  )}

                  {/* Holiday Name at Bottom */}
                  {holidayName && (
                    <div className={`w-full text-[6px] font-bold uppercase px-0.5 leading-[1.1] text-center mt-auto relative z-30 pb-0.5 ${shifts.length > 0 ? 'text-white/90 drop-shadow-md truncate' : 'text-black whitespace-normal break-words'}`}>
                      {shifts.length > 0 ? 'FERIADO' : holidayName}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-around bg-[#060616] rounded-2xl p-2 mb-2">
        <button onClick={() => setMode('PINTAR')} className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${mode === 'PINTAR' ? 'text-lime-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}>
          <i className="fas fa-paint-brush text-2xl"></i>
        </button>
        <button onClick={() => setMode('EDITAR')} className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${mode === 'EDITAR' ? 'text-blue-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}>
          <i className="fas fa-edit text-2xl"></i>
        </button>
        <button onClick={() => setMode('TURNOS')} className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${mode === 'TURNOS' ? 'text-slate-200 scale-110' : 'text-slate-600 hover:text-slate-400'}`}>
          <i className="fas fa-th-list text-2xl"></i>
        </button>
      </div>

      {(mode === 'PINTAR' || mode === 'EDITAR') && (
        <div className="bg-[#0f172a]/50 backdrop-blur-xl rounded-3xl pt-4 pb-4 pr-4 pl-3 border border-slate-800 shadow-xl overflow-x-auto custom-scrollbar mb-1 -mt-1 -ml-[1px] h-[66.5px] w-[376px]">
          <div className="flex space-x-3 min-w-max mb-0 -mt-[9px]">
            {mode === 'PINTAR' && (
              <button 
                onClick={() => setActiveShiftId('eraser')} 
                className={`w-12 h-12 rounded-lg border border-slate-700 flex items-center justify-center transition-all ${activeShiftId === 'eraser' ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-900/50 text-slate-500 hover:text-slate-200'}`}
              >
                <i className="fas fa-eraser text-lg"></i>
              </button>
            )}
            {visibleShiftTypes.map(s => (
              <button 
                key={s.id} 
                onClick={() => mode === 'EDITAR' ? openEditShift(s) : setActiveShiftId(s.id)} 
                style={{ backgroundColor: s.color, color: s.textColor, fontSize: `${s.fontSize || 10}px` }} 
                className={`w-12 h-12 rounded-lg border border-slate-700 flex items-center justify-center font-black shadow-lg transition-all transform ${activeShiftId === s.id && mode !== 'EDITAR' ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'} p-0.5 break-all leading-none text-center`}
              >
                {mode === 'EDITAR' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <i className="fas fa-pen text-white text-[10px]"></i>
                  </div>
                )}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isConfiguringShift && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-2 animate-fade-in">
          <div className="bg-[#0f172a] w-full max-w-xs rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-tight flex items-center">
                <i className="fas fa-sliders-h mr-2 text-lime-400"></i> Configurar Turno
              </h3>
              <button onClick={() => setIsConfiguringShift(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex-1">
                  <label className="text-[8px] font-bold text-slate-500 uppercase block mb-1 px-1">Abreviatura</label>
                  <input 
                    type="text" 
                    placeholder="NOVO" 
                    className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-slate-200 font-black text-xs outline-none focus:ring-2 focus:ring-lime-600 uppercase shadow-inner" 
                    value={configShift.label} 
                    onChange={e => setConfigShift({...configShift, label: e.target.value.toUpperCase()})} 
                  />
                </div>
                <div 
                  style={{ backgroundColor: configShift.color, color: configShift.textColor, fontSize: `${configShift.fontSize || 10}px` }} 
                  className="w-12 h-12 rounded-lg shadow-lg flex items-center justify-center font-black border border-white/5 overflow-hidden p-0.5 break-all leading-none text-center"
                >
                  {configShift.label}
                </div>
              </div>

              <div className="space-y-3">
                <ColorPaletteRow 
                  label="Cor de Fundo" 
                  currentColor={configShift.color} 
                  onTriggerPicker={() => setShowPicker({ field: 'color' })} 
                  onSelectColor={(c) => { setConfigShift({...configShift, color: c}); pushToFavorites(c, true); }}
                  favorites={favoriteBgColors} 
                  isBg={true} 
                />
                <ColorPaletteRow 
                  label="Cor do Texto" 
                  currentColor={configShift.textColor} 
                  onTriggerPicker={() => setShowPicker({ field: 'textColor' })} 
                  onSelectColor={(c) => { setConfigShift({...configShift, textColor: c}); pushToFavorites(c, false); }}
                  favorites={favoriteTextColors} 
                  isBg={false} 
                />

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block px-1">Tamanho do Texto</label>
                  <div className="bg-slate-950/50 p-3 rounded-xl flex items-center gap-3 border border-white/5 shadow-inner">
                    <span className="text-slate-400 font-black w-5 text-center text-xs">{configShift.fontSize || 10}</span>
                    <input 
                      type="range" 
                      min="6" 
                      max="24" 
                      step="1" 
                      className="flex-1 accent-lime-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                      value={configShift.fontSize || 10} 
                      onChange={e => setConfigShift({...configShift, fontSize: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => setIsConfiguringShift(false)} className="bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-slate-400 font-black uppercase text-[10px] border border-white/5 transition-all">Cancelar</button>
                  <button onClick={handleSaveShiftConfig} className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 py-3 rounded-xl text-slate-900 font-black uppercase text-[10px] shadow-lg shadow-lime-900/20 transition-all">Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'TURNOS' && !isConfiguringShift && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col p-4 animate-fade-in">
          <div className="bg-[#0f172a] w-full h-full rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-tight flex items-center">
                <i className="fas fa-th-list mr-2 text-lime-400"></i> Gestão de Turnos
              </h3>
              <button onClick={() => setMode('PINTAR')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              <button 
                onClick={() => { setConfigShift({ name: '', label: 'NOVO', color: '#059669', textColor: '#ffffff', fontSize: 10, showTime: false }); setEditingShiftId(null); setIsConfiguringShift(true); }} 
                className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 py-3 rounded-xl text-slate-900 font-black uppercase text-[10px] mb-4 flex items-center justify-center shadow-lg shadow-lime-900/20 active:scale-95 transition-all"
              >
                <i className="fas fa-plus mr-2"></i> Adicionar Turno
              </button>
              
              <div className="space-y-2">
                {visibleShiftTypes.map(s => (
                  <div key={s.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div style={{ backgroundColor: s.color, color: s.textColor, fontSize: `${s.fontSize || 10}px` }} className="w-12 h-12 rounded-lg flex items-center justify-center font-black shadow-lg p-0.5 break-all leading-none text-center">
                        {s.label}
                      </div>
                      <span className="text-xs font-bold text-slate-300">{s.name || 'Turno Personalizado'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEditShift(s)} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                        <i className="fas fa-pen text-[10px]"></i>
                      </button>
                      <button onClick={() => onDeleteShiftType(s.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                        <i className="fas fa-trash-alt text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 z-[160] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] w-full max-w-md rounded-3xl border border-white/5 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5">
               <h3 className="text-lg font-black uppercase text-slate-200 tracking-tight text-center">Edição do Dia</h3>
               <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{new Date(editingEvent.date!).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              {editingEvent.shiftTypeIds?.map(id => {
                const currentShift = getShiftWithOverrides(id, editingEvent as CalendarEvent);
                if (!currentShift) return null;
                const baseShift = shiftTypes.find(s => s.id === id);
                return (
                  <div key={id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                       <div style={{ backgroundColor: currentShift.color, color: currentShift.textColor, fontSize: `${currentShift.fontSize || 10}px` }} className="w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-lg shrink-0 p-0.5 break-all leading-none text-center">{currentShift.label}</div>
                       <div className="flex-1">
                         <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 px-1">Nome Local</label>
                         <input type="text" className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs font-black uppercase outline-none focus:ring-1 focus:ring-lime-600 text-slate-200" value={editingEvent.overrides?.[id]?.label || currentShift.label} onChange={(e) => updateOverride(id, 'label', e.target.value)} />
                       </div>
                    </div>
                    
                    <ColorPaletteRow 
                      label="Cor de Fundo" 
                      currentColor={currentShift.color} 
                      onTriggerPicker={() => setShowPicker({ field: 'override_bg', shiftId: id })} 
                      onSelectColor={(c) => { updateOverride(id, 'color', c); pushToFavorites(c, true); }}
                      favorites={favoriteBgColors} 
                      isBg={true} 
                    />
                    <ColorPaletteRow 
                      label="Cor do Texto" 
                      currentColor={currentShift.textColor} 
                      onTriggerPicker={() => setShowPicker({ field: 'override_text', shiftId: id })} 
                      onSelectColor={(c) => { updateOverride(id, 'textColor', c); pushToFavorites(c, false); }}
                      favorites={favoriteTextColors} 
                      isBg={false} 
                    />
                  </div>
                );
              })}
              
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Anotação</h4>
                <textarea className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-xs font-bold text-slate-200 uppercase outline-none focus:ring-2 focus:ring-lime-600/50 shadow-inner" rows={3} value={editingEvent.observation || ''} onChange={(e) => setEditingEvent({...editingEvent, observation: e.target.value.toUpperCase()})} placeholder="DIGITE SUA OBSERVAÇÃO..." />
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 bg-white/5 grid grid-cols-2 gap-4">
              <button onClick={() => setEditingEvent(null)} className="bg-slate-800 text-slate-400 font-black py-3.5 rounded-2xl uppercase text-[10px] border border-white/5 hover:bg-slate-700 transition-all">Cancelar</button>
              <button onClick={() => { onSaveEvent(editingEvent as CalendarEvent); setEditingEvent(null); }} className="bg-gradient-to-r from-lime-600 to-green-600 text-slate-900 font-black py-3.5 rounded-2xl uppercase text-[10px] shadow-lg hover:from-lime-500 hover:to-green-500 transition-all">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;