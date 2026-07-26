import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

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
        Previous
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onNext}
        disabled={!hasSelected}
        className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLast ? 'View Results' : 'Next'}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}