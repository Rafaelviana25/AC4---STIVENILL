
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CalendarEvent, ShiftType } from '../types';
import { MONTH_NAMES, HOLIDAYS } from '../constants';

// --- COMPONENTE DE SELETOR DE CORES CUSTOMIZADO (IDENTIDADE TÁTICA) ---
const TacticalColorPicker = ({ color, onChange, onConfirm, onClose }: { color: string, onChange: (hex: string) => void, onConfirm: (hex: string) => void, onClose: () => void }) => {
  const [hex, setHex] = useState(color || '#059669');
  const [hue, setHue] = useState(0); 
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const { r, g, b } = hexToRgb(hex);

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: string) => {
    const n = Math.max(0, Math.min(255, parseInt(val) || 0));
    const newRgb = { r, g, b, [channel]: n };
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    onChange(newHex);
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const whiteGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    whiteGrad.addColorStop(0, 'white');
    whiteGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const blackGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackGrad.addColorStop(0, 'transparent');
    blackGrad.addColorStop(1, 'black');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [hue]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const updateColorFromCanvas = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const clampedX = Math.max(0, Math.min(canvas.width - 1, x));
    const clampedY = Math.max(0, Math.min(canvas.height - 1, y));
    
    const imageData = ctx.getImageData(clampedX, clampedY, 1, 1).data;
    const newHex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    setHex(newHex);
    onChange(newHex);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div 
        className="w-[280px] bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,1)] border border-white/10 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <canvas 
          ref={canvasRef}
          width={280}
          height={140}
          className="w-full h-[140px] cursor-crosshair touch-none"
          onMouseDown={updateColorFromCanvas}
          onMouseMove={(e) => e.buttons === 1 && updateColorFromCanvas(e)}
          onTouchMove={updateColorFromCanvas}
          onTouchStart={updateColorFromCanvas}
        />

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-4">
             <i className="fas fa-eye-dropper text-white/40 text-xs"></i>
             <div className="w-10 h-10 rounded-full border-2 border-white/20 shadow-inner shrink-0" style={{ backgroundColor: hex }}></div>
             <input 
              type="range" 
              min="0"
              max="360"
              value={hue}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
              onChange={(e) => setHue(parseInt(e.target.value))}
             />
          </div>

          <div className="flex justify-between items-end gap-2">
            {[
              { label: 'R', val: r, key: 'r' as const },
              { label: 'G', val: g, key: 'g' as const },
              { label: 'B', val: b, key: 'b' as const }
            ].map(item => (
              <div key={item.key} className="flex-1 text-center">
                <input 
                  type="number" 
                  value={item.val}
                  onChange={e => handleRgbChange(item.key, e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white text-center py-2 rounded-lg border border-white/10 outline-none text-xs font-black focus:border-emerald-500 transition-colors" 
                />
                <span className="text-[9px] text-white/30 font-bold mt-1.5 block tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onConfirm(hex)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-[0_5px_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
          >
            Confirmar Cor
          </button>
        </div>
      </div>
    </div>
  );
};

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
    fontSize: 3,
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
      fontSize: Number(configShift.fontSize) || 3,
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

  // ESTILO DE TEXTO PADRÃO SEM ADAPTAÇÕES ESPECÍFICAS
  const shiftTextStyle = (s: Partial<ShiftType>) => {
    const size = Number(s.fontSize) || 3;
    return {
      color: s.textColor,
      fontSize: `${size}px`,
      lineHeight: '1',
      fontWeight: '900',
      textAlign: 'center' as const,
      fontStyle: 'normal',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: '1px'
    };
  };

  const shiftTextClasses = "text-center w-full h-full flex items-center justify-center whitespace-normal break-all overflow-hidden uppercase";
  const shiftSquareClasses = "w-12 h-12 shrink-0 flex items-center justify-center border border-black/10 overflow-hidden shadow-lg rounded-none transition-all";

  const ColorPaletteRow = ({ label, currentColor, onTriggerPicker, onSelectColor, favorites, isBg }: any) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block text-center">
        {label}
      </label>
      <div className="bg-slate-900/80 p-2.5 rounded-[22px] border border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-inner w-full min-h-[58px]">
        <button 
          onClick={onTriggerPicker}
          className="shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-lg active:scale-95 transition-all group"
        >
          <i className="fas fa-palette text-white text-[11px] group-hover:rotate-12 transition-transform"></i>
        </button>
        {favorites.map((c: string) => (
          <button 
            key={c} 
            onClick={() => onSelectColor(c)} 
            style={{ backgroundColor: c }} 
            className={`w-10 h-10 rounded-[14px] shrink-0 border border-black/30 flex items-center justify-center transition-all active:scale-90 ${currentColor?.toUpperCase() === c.toUpperCase() ? 'ring-2 ring-white scale-110 z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'opacity-80 hover:opacity-100'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white animate-fade-in -mt-4 transition-colors overflow-hidden w-full">
      {showPicker && (
        <TacticalColorPicker 
          color={
            showPicker.field === 'color' ? configShift.color! : 
            showPicker.field === 'textColor' ? configShift.textColor! :
            showPicker.field === 'override_bg' ? (getShiftWithOverrides(showPicker.shiftId!, editingEvent as CalendarEvent)?.color || '#000') :
            (getShiftWithOverrides(showPicker.shiftId!, editingEvent as CalendarEvent)?.textColor || '#fff')
          }
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

      {selectedHolidayInfo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 pointer-events-none">
           <div className="bg-[#C0C0C0] border border-black/10 rounded-lg p-3 shadow-[0_10px_25px_rgba(0,0,0,0.2)] text-center max-w-[150px] w-auto animate-fade-in pointer-events-auto" onClick={() => setSelectedHolidayInfo(null)}>
              <p className="text-black font-black uppercase text-[9.5px] leading-tight drop-shadow-sm">{selectedHolidayInfo}</p>
           </div>
        </div>
      )}

      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-black transition-colors px-3 py-3">
        <div className="flex items-center w-full">
          <div className="h-6 w-1 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
            Agenda <span className="text-emerald-500">Mensal</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar w-full">
        <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-950 transition-colors">
          <button onClick={prevMonth} className="text-lg text-slate-400 dark:text-slate-500 p-2"><i className="fas fa-chevron-left"></i></button>
          <h2 className="text-sm font-black uppercase tracking-tighter text-slate-800 dark:text-white">{MONTH_NAMES[month]} <span className="text-slate-400 dark:text-slate-500">{year}</span></h2>
          <button onClick={nextMonth} className="text-lg text-slate-400 dark:text-slate-500 p-2"><i className="fas fa-chevron-right"></i></button>
        </div>

        <div className="grid grid-cols-[20px_repeat(7,1fr)] border-t border-slate-300 dark:border-black bg-slate-200 dark:bg-black gap-[1px] w-full">
          <div className="bg-slate-100 dark:bg-slate-900 transition-colors"></div>
          {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, idx) => (
            <div key={idx} className={`text-center py-1 text-[8px] font-black border-none ${idx >= 5 ? 'bg-red-600 dark:bg-[#990000] text-white' : 'bg-slate-300 dark:bg-slate-300 text-black'}`}>{d}</div>
          ))}
          {Array.from({ length: 6 }).map((_, weekIdx) => (
            <React.Fragment key={weekIdx}>
              <div className="bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-[7px] text-slate-400 dark:text-slate-500 font-bold">{weekIdx + 1}</div>
              {calendarGrid.slice(weekIdx * 7, (weekIdx + 1) * 7).map((dayObj, dIdx) => {
                const dateObj = new Date(year, month + dayObj.monthOffset, dayObj.day);
                const dateStr = dateObj.toISOString().split('T')[0];
                const mmdd = `${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                const holidayName = HOLIDAYS[dateStr] || HOLIDAYS[mmdd];
                
                const isToday = dateStr === todayStr;
                const event = events.find(e => e.date === dateStr);
                const shifts = event ? event.shiftTypeIds.map(id => getShiftWithOverrides(id, event)).filter(Boolean) as ShiftType[] : [];
                
                return (
                  <button 
                    key={dIdx} 
                    onClick={() => handleDayClick(dayObj)} 
                    style={holidayName ? { backgroundColor: '#C0C0C0' } : {}}
                    className={`relative aspect-square border-none flex flex-col overflow-hidden transition-all ${shifts.length === 0 && dayObj.currentMonth && !holidayName ? 'bg-white' : ''} ${!dayObj.currentMonth ? 'opacity-50' : ''}`}
                  >
                    <div className={`absolute top-0.5 right-0.5 w-3.5 h-3.5 flex items-center justify-center z-20 ${isToday ? 'ring-2 ring-emerald-500 rounded-full bg-emerald-500/10' : ''} ${shifts.length > 0 ? 'bg-black/20 rounded-full backdrop-blur-[1px]' : ''}`}>
                      <span className={`text-[8px] font-black ${shifts.length > 0 ? 'text-white' : (isToday ? 'text-emerald-600' : (dayObj.currentMonth ? 'text-black' : 'text-slate-400'))}`}>{dayObj.day}</span>
                    </div>
                    
                    {shifts.length > 0 ? (
                      <div className="flex flex-col h-full w-full">
                        <div className="flex-1 flex flex-col w-full overflow-hidden">
                          {shifts.map((s, idx) => (
                            <div key={idx} style={{ backgroundColor: s.color }} className={`flex-1 w-full flex items-center justify-center p-0 overflow-hidden border-black/5 ${idx === 0 && shifts.length === 2 ? 'border-b' : ''} ${!dayObj.currentMonth ? 'opacity-40' : ''}`}>
                              <span style={shiftTextStyle(s)} className={shiftTextClasses}>{s.label}</span>
                            </div>
                          ))}
                        </div>
                        {holidayName && (
                          <div className="bg-white/30 backdrop-blur-[1px] h-[10px] flex items-center justify-center border-t border-black/5">
                            <span className="text-[5.5px] font-black text-black uppercase leading-none">FERIADO</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-end w-full pb-0.5 px-0.5 relative">
                        {event?.observation && <i className="fas fa-sticky-note text-[8px] text-slate-300 absolute top-1 left-1"></i>}
                        {holidayName && (
                          <div className="w-full flex items-center justify-center min-h-[12px] pb-1">
                            <span className="text-[5.5px] font-black text-black/80 uppercase text-center px-0.5 leading-tight whitespace-normal break-words">
                              {holidayName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {(mode === 'PINTAR' || mode === 'EDITAR') && (
          <div className="flex overflow-x-auto p-3 space-x-3 bg-white dark:bg-slate-950 no-scrollbar items-center border-b border-slate-100 dark:border-slate-900">
            {mode === 'PINTAR' && (
              <button onClick={() => setActiveShiftId('eraser')} className={`flex-shrink-0 w-12 h-12 border border-slate-300 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-all ${activeShiftId === 'eraser' ? 'z-10 opacity-100 border-2 border-blue-500' : 'opacity-40'}`}><i className="fas fa-eraser text-slate-600 dark:text-slate-400 text-lg"></i></button>
            )}
            {visibleShiftTypes.map(s => (
              <button 
                key={s.id} 
                onClick={() => mode === 'EDITAR' ? openEditShift(s) : setActiveShiftId(s.id)} 
                style={{ backgroundColor: s.color }} 
                className={`relative ${shiftSquareClasses} ${activeShiftId === s.id && mode !== 'EDITAR' ? 'opacity-100 border-2 border-white/50 scale-105 shadow-md' : 'opacity-40'}`}
              >
                {mode === 'EDITAR' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                    <i className="fas fa-pen text-white/70 text-[10px] drop-shadow-md"></i>
                  </div>
                )}
                <span style={shiftTextStyle(s)} className={shiftTextClasses}>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-around py-4 bg-slate-50 dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-black">
          <button onClick={() => setMode('PINTAR')} className={`flex flex-col items-center space-y-1.5 transition-colors ${mode === 'PINTAR' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`}><i className="fas fa-paint-brush text-lg"></i><span className="text-[8px] font-black uppercase tracking-[0.2em]">Pintar</span></button>
          <button onClick={() => setMode('EDITAR')} className={`flex flex-col items-center space-y-1.5 transition-colors ${mode === 'EDITAR' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`}><i className="fas fa-edit text-lg"></i><span className="text-[8px] font-black uppercase tracking-[0.2em]">Editar</span></button>
          <button onClick={() => setMode('TURNOS')} className={`flex flex-col items-center space-y-1.5 transition-colors ${mode === 'TURNOS' ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-600'}`}><i className="fas fa-th-list text-lg"></i><span className="text-[8px] font-black uppercase tracking-[0.2em]">Turnos</span></button>
        </div>
      </div>

      {isConfiguringShift && (
        <div className="fixed inset-0 z-[400] bg-[#020617] flex flex-col animate-fade-in overflow-hidden">
          <div className="pt-4 pb-1 flex flex-col items-center border-b border-slate-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Configuração do Turno</h3>
          </div>
          
          <div className="flex-1 px-5 py-3 space-y-4 overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 px-1">Abreviatura</label>
                <input 
                  type="text" 
                  placeholder="Novo" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-black text-xs outline-none focus:ring-1 focus:ring-emerald-500 uppercase" 
                  value={configShift.label} 
                  onChange={e => setConfigShift({...configShift, label: e.target.value.toUpperCase()})} 
                />
              </div>
              <div style={{ backgroundColor: configShift.color }} className={shiftSquareClasses}>
                <span style={shiftTextStyle(configShift)} className={shiftTextClasses}>{configShift.label}</span>
              </div>
            </div>

            <div className="space-y-4">
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

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block text-center">Tamanho do Texto</label>
                <div className="bg-slate-900/60 p-3 rounded-xl flex items-center gap-4 border border-slate-800">
                  <span className="text-emerald-500 font-black w-6 text-center text-xs">{configShift.fontSize || 3}</span>
                  <input 
                    type="range" 
                    min="3" 
                    max="15" 
                    step="1" 
                    className="flex-1 accent-emerald-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    value={configShift.fontSize || 3} 
                    onChange={e => setConfigShift({...configShift, fontSize: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={() => setIsConfiguringShift(false)} className="bg-slate-800 hover:bg-slate-700 py-3.5 rounded-xl text-slate-400 font-black uppercase text-[10px] border border-slate-700 transition-all">Cancelar</button>
                <button onClick={handleSaveShiftConfig} className="bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-xl text-white font-black uppercase text-[10px] shadow-xl transition-all">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === 'TURNOS' && !isConfiguringShift && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col p-4 animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Gestão de Turnos</h3>
            <button onClick={() => setMode('PINTAR')} className="text-slate-400 dark:text-white p-2 hover:rotate-90 transition-transform">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <button onClick={() => { setConfigShift({ name: '', label: 'NOVO', color: '#059669', textColor: '#ffffff', fontSize: 3, showTime: false }); setEditingShiftId(null); setIsConfiguringShift(true); }} className="w-full bg-emerald-600 py-4 rounded-2xl text-white font-black uppercase text-[10px] mb-6 flex items-center justify-center shadow-lg active:scale-95 transition-all">
            <i className="fas fa-plus mr-3"></i> Adicionar Turno
          </button>
          
          <div className="space-y-1 flex-1 pb-20">
            {visibleShiftTypes.map(s => (
              <div key={s.id} className="bg-slate-50 dark:bg-slate-900/50 p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-900">
                <div className="flex items-center">
                  <div style={{ backgroundColor: s.color }} className={`${shiftSquareClasses} scale-90`}>
                    <span style={shiftTextStyle(s)} className={shiftTextClasses}>{s.label}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button onClick={() => openEditShift(s)} className="text-blue-600 dark:text-blue-400 p-2 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <i className="fas fa-edit text-base"></i>
                  </button>
                  <button onClick={() => onDeleteShiftType(s.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                    <i className="fas fa-trash-alt text-base"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 z-[160] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] w-full max-sm rounded-3xl border-t-4 border-emerald-500 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
            <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
              <h3 className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-500 tracking-widest text-center">Edição Local do Dia</h3>
              {editingEvent.shiftTypeIds?.map(id => {
                const currentShift = getShiftWithOverrides(id, editingEvent as CalendarEvent);
                if (!currentShift) return null;
                const baseShift = shiftTypes.find(s => s.id === id);
                return (
                  <div key={id} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                       <div style={{ backgroundColor: currentShift.color }} className={shiftSquareClasses}><span style={shiftTextStyle(currentShift)} className={shiftTextClasses}>{currentShift.label}</span></div>
                       <div className="flex-1"><label className="text-[8px] font-black text-slate-400 uppercase">Nome/Sigla Local</label><input type="text" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-[10px] font-black uppercase outline-none" value={editingEvent.overrides?.[id]?.label || currentShift.label} onChange={(e) => updateOverride(id, 'label', e.target.value)} /></div>
                       {baseShift && (
                         <button 
                          onClick={() => { setEditingEvent(null); openEditShift(baseShift); }}
                          className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                          title="Configuração Global"
                         >
                           <i className="fas fa-cog text-xs"></i>
                         </button>
                       )}
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
              <div className="space-y-4"><h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Anotação do Dia</h4><textarea className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-900 dark:text-white uppercase outline-none focus:ring-2 focus:ring-emerald-500/50" rows={3} value={editingEvent.observation} onChange={(e) => setEditingEvent({...editingEvent, observation: e.target.value.toUpperCase()})} placeholder="DIGITE SUA OBSERVAÇÃO AQUI..." /></div>
            </div>
            <div className="p-6 pt-0 grid grid-cols-2 gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"><button onClick={() => { onSaveEvent(editingEvent as CalendarEvent); setEditingEvent(null); }} className="bg-emerald-600 text-white font-black py-3 rounded-2xl uppercase text-[10px] shadow-lg">Confirmar</button><button onClick={() => setEditingEvent(null)} className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-black py-3 rounded-2xl uppercase text-[10px] border border-slate-200 dark:border-slate-700">Fechar</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;
