import React, { useState, useRef, useEffect, useCallback } from 'react';

export const TacticalColorPicker = ({ color, onChange, onConfirm, onClose, previewConfig }: { color: string, onChange: (hex: string) => void, onConfirm: (hex: string) => void, onClose: () => void, previewConfig?: { label: string, textColor: string, bgColor: string, fontSize: number } }) => {
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
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-[300px] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative group cursor-crosshair">
          <canvas 
            ref={canvasRef}
            width={300}
            height={150}
            className="w-full h-[150px] touch-none"
            onMouseDown={updateColorFromCanvas}
            onMouseMove={(e) => e.buttons === 1 && updateColorFromCanvas(e)}
            onTouchMove={updateColorFromCanvas}
            onTouchStart={updateColorFromCanvas}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-t-3xl"></div>
        </div>

        <div className="p-5 space-y-5">
          {previewConfig && (
            <div className="flex justify-center pb-2 border-b border-white/5">
               <div 
                  style={{ backgroundColor: previewConfig.bgColor, color: previewConfig.textColor, fontSize: `${previewConfig.fontSize || 10}px` }} 
                  className="w-12 h-12 rounded-lg shadow-lg flex items-center justify-center font-black border border-white/10 overflow-hidden p-0.5 break-all leading-none text-center"
                >
                  {previewConfig.label}
                </div>
            </div>
          )}

          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl border border-white/20 shadow-lg shrink-0 transition-transform hover:scale-105" style={{ backgroundColor: hex }}></div>
             <div className="flex-1 space-y-2">
               <input 
                type="range" 
                min="0"
                max="360"
                value={hue}
                className="w-full h-3 rounded-full appearance-none cursor-pointer shadow-inner"
                style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
                onChange={(e) => setHue(parseInt(e.target.value))}
               />
               <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                 <span>Matiz</span>
                 <span>{hue}°</span>
               </div>
             </div>
          </div>

          <div className="flex gap-2">
            {[
              { label: 'R', val: r, key: 'r' as const },
              { label: 'G', val: g, key: 'g' as const },
              { label: 'B', val: b, key: 'b' as const }
            ].map(item => (
              <div key={item.key} className="flex-1">
                <input 
                  type="number" 
                  value={item.val}
                  onChange={e => handleRgbChange(item.key, e.target.value)}
                  className="w-full bg-zinc-800 text-white text-center py-2.5 rounded-xl border border-white/5 outline-none text-xs font-bold focus:ring-2 focus:ring-zinc-500/50 transition-all" 
                />
                <span className="text-[9px] text-zinc-500 font-bold mt-1.5 block text-center uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onConfirm(hex)}
            className="w-full bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-black py-3.5 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-zinc-900/20 active:scale-95 transition-all"
          >
            Confirmar Cor
          </button>
        </div>
      </div>
    </div>
  );
};
