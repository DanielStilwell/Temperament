import { useNavigate } from 'react-router-dom';
import { RotateCcw, Share2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import useAssessmentStore from '../../stores/assessment';

export default function ActionButtons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reset = useAssessmentStore((s) => s.reset);
  const mode = useAssessmentStore((s) => s.mode);

  const handleReset = () => {
    reset();
    navigate('/assessment');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(t('result.shareSuccess'));
    } catch {
      alert(t('result.shareFail'));
    }
  };

  // 管理者代填模式：保存被观察者到团队
  if (mode === 'observer') {
    const handleDiscard = () => {
      if (confirm(t('result.discardConfirm'))) {
        reset();
        // 草稿里没有 tier 信息，按 profession 跳回工作台不太可行，统一回首页让用户重新进
        navigate('/');
      }
    };

    return (
      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={handleDiscard} className="flex-1">
          <X className="w-4 h-4" />
          {t('result.discard')}
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/save-observer')} className="flex-1">
          <Save className="w-4 h-4" />
          {t('result.saveToTeam')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button variant="outline" size="md" onClick={handleReset} className="flex-1">
        <RotateCcw className="w-4 h-4" />
        {t('result.retake')}
      </Button>
      <Button variant="primary" size="md" onClick={handleShare} className="flex-1">
        <Share2 className="w-4 h-4" />
        {t('result.share')}
      </Button>
    </div>
  );
}
