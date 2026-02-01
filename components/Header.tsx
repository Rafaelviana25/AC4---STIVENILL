
import React from 'react';

interface HeaderProps {
  onToggleTheme?: () => void;
  theme?: 'dark' | 'light';
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#020617] text-white shadow-2xl z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-5 flex items-center justify-start max-w-lg">
        {/* TÍTULO AJUSTADO CONFORME SOLICITAÇÃO: AC4 (BRANCO) STIVENILL (VERDE) */}
        <h1 className="text-2xl font-black uppercase flex items-center tracking-tighter leading-none">
          <span className="text-white">AC4</span>
          <span className="text-emerald-500 ml-2">STIVENILL</span>
        </h1>
      </div>
      {/* FITA VERDE (LINHA DE SEPARAÇÃO) SOLICITADA */}
      <div className="h-1 w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
    </header>
  );
};

export default Header;
