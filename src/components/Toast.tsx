import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
      <div className={`
        px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3
        ${type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : ''}
        ${type === 'info' ? 'bg-info/10 border-info/20 text-info' : ''}
        ${type === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' : ''}
      `}>
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
