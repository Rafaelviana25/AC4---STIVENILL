
import React from 'react';

interface HeaderProps {
  onToggleTheme?: () => void;
  theme?: 'dark' | 'light';
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 z-50 transition-all duration-300"
      style={{ paddingTop: 'var(--sat)' }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-center max-w-lg">
        {/* TÍTULO AJUSTADO CONFORME SOLICITAÇÃO: AC4 (BRANCO) STIVENILL (VERDE NEON/AZUL) */}
        <h1 className="text-base font-black uppercase flex items-center tracking-tighter leading-none select-none gap-2">
          <span className="text-lime-500 drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]">AC4</span>
          <span className="text-white opacity-40">-</span>
          <span className="text-slate-200">STIVENILL</span>
        </h1>
      </div>
      {/* FITA (LINHA DE SEPARAÇÃO) SOLICITADA */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-lime-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;
