import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
}

export default function Disclaimer({ className = '' }: DisclaimerProps) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-50/80 border border-amber-200/50 text-amber-800 text-sm leading-relaxed ${className}`}
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
      <span>This app is for self-exploration and entertainment only. It does not constitute professional psychological assessment or medical advice.</span>
    </div>
  );
}