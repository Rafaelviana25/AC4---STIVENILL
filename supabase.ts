
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-lime-900/80 border-lime-700/50 text-lime-200 shadow-lime-900/20',
    error: 'bg-red-900/80 border-red-700/50 text-red-200 shadow-red-900/20',
    info: 'bg-blue-900/80 border-blue-700/50 text-blue-200 shadow-blue-900/20'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  return (
    <div className={`fixed top-24 right-4 ${bgColors[type]} backdrop-blur-xl border px-4 py-3 rounded-2xl shadow-2xl z-[1000] animate-fade-in flex items-center space-x-3 max-w-xs transition-all transform hover:scale-105`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 shadow-inner`}>
        <i className={`fas ${icons[type]} text-lg`}></i>
      </div>
      <span className="text-xs font-black uppercase tracking-wide text-white drop-shadow-md">{message}</span>
    </div>
  );
};

export default Toast;
