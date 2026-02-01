
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* Container da Logo (Distintivo AC4) */}
        <div className="relative w-64 h-72 flex items-center justify-center">
          <img 
            src="logo.png" 
            alt="AC4 Tactical Badge" 
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-badge-entrance"
            onError={(e) => {
              console.error("Erro ao carregar logo.png na Splash Screen");
            }}
          />
          
          {/* Aura de brilho esmeralda que pulsa atrás do distintivo */}
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full -z-10 animate-aura-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full -z-20"></div>
        </div>
        
        <div className="mt-14 flex flex-col items-center text-center">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 italic drop-shadow-md">
            AC4 <span className="text-emerald-500">SYSTEM</span>
          </h2>
          
          {/* Barra de carregamento tática */}
          <div className="relative h-1 w-48 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 w-full animate-loading-bar"></div>
          </div>
          
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">
            Sincronizando Módulos Operacionais
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes badge-entrance {
          0% { transform: scale(0.8) translateY(30px); opacity: 0; filter: brightness(0) contrast(1.5); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: brightness(1.1) contrast(1.1); }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-badge-entrance {
          animation: badge-entrance 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-aura-pulse {
          animation: aura-pulse 4s ease-in-out infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
