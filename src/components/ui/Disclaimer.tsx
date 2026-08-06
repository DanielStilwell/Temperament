import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DisclaimerProps {
  className?: string;
}

export default function Disclaimer({ className = '' }: DisclaimerProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-50/80 border border-amber-200/50 text-amber-800 text-sm leading-relaxed ${className}`}
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
      <span>{t('disclaimer.text')}</span>
    </div>
  );
}
