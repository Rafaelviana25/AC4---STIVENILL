
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
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };

  return (
    <div className={`fixed top-20 right-4 ${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-xl z-[100] animate-fade-in flex items-center space-x-3 max-w-xs`}>
      <i className={`fas ${icons[type]}`}></i>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
