
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
        <div className="flex items-center justify-center h-8">
          <img 
            src="/LOGO AC4 BRANCO.png" 
            alt="AC4 STIVENILL" 
            className="h-full w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      {/* FITA (LINHA DE SEPARAÇÃO) SOLICITADA */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-lime-500/50 to-transparent"></div>
    </header>
  );
};

export default Header;
