
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-lime-900/20 via-[#0f172a] to-blue-900/20 pointer-events-none"></div>
      
      <div className="relative flex flex-col items-center animate-fade-in z-10">
        {/* Container da Logo (Distintivo AC4) */}
        <div className="relative w-64 h-72 flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/30 to-blue-500/30 blur-[60px] rounded-full animate-pulse"></div>
          <img 
            src="logo.png" 
            alt="AC4 Tactical Badge" 
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(163,230,53,0.3)] animate-badge-entrance relative z-10 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              console.error("Erro ao carregar logo.png na Splash Screen");
            }}
          />
        </div>
        
        <div className="mt-12 flex flex-col items-center text-center space-y-6">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            AC4 <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-blue-500">SYSTEM</span>
          </h2>
          
          {/* Barra de carregamento tática */}
          <div className="relative h-1.5 w-64 bg-slate-800/50 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent w-1/2 animate-loading-bar blur-sm"></div>
            <div className="h-full bg-gradient-to-r from-lime-400 via-green-500 to-blue-500 w-full animate-loading-bar shadow-[0_0_10px_rgba(163,230,53,0.8)]"></div>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400/80 animate-pulse drop-shadow-sm">
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
