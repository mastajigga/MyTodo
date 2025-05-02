import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface TaskSuccessModalProps {
  show: boolean;
  onClose: () => void;
}

export const TaskSuccessModal = ({ show, onClose }: TaskSuccessModalProps) => {
  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(onClose, 2000);
    return () => clearTimeout(timeout);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-xl p-8 animate-pop-in flex flex-col items-center gap-2">
        <CheckCircle2 className="text-green-500 w-12 h-12 animate-bounce" />
        <span className="text-lg font-semibold">Tâche ajoutée avec succès !</span>
      </div>
      <style jsx>{`
        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}; 