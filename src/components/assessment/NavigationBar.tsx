import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface NavigationBarProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isLast: boolean;
  hasSelected: boolean;
}

export default function NavigationBar({
  onPrev,
  onNext,
  canGoPrev,
  isLast,
  hasSelected,
}: NavigationBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="md"
        onClick={onPrev}
        disabled={!canGoPrev}
        className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('assessment.previous')}
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onNext}
        disabled={!hasSelected}
        className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLast ? t('assessment.viewResults') : t('assessment.next')}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}