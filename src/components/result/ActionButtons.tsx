import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Share2, Save, X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import Button from '../ui/Button';
import ShareCard from './ShareCard';
import useAssessmentStore from '../../stores/assessment';

export default function ActionButtons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reset = useAssessmentStore((s) => s.reset);
  const mode = useAssessmentStore((s) => s.mode);
  const result = useAssessmentStore((s) => s.result);

  const [showCard, setShowCard] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    reset();
    navigate('/assessment');
  };

  const handleShare = () => {
    setShowCard(true);
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      // 尝试调用系统分享（移动端）
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'tempe-result.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Tempe',
            text: t('shareCard.shareText'),
          });
          setSaving(false);
          setShowCard(false);
          return;
        }
      }

      // 回退：下载图片
      const link = document.createElement('a');
      link.download = 'tempe-result.png';
      link.href = dataUrl;
      link.click();
    } catch {
      alert(t('shareCard.saveFail'));
    } finally {
      setSaving(false);
    }
  };

  // 管理者代填模式：保存被观察者到团队
  if (mode === 'observer') {
    const handleDiscard = () => {
      if (confirm(t('result.discardConfirm'))) {
        reset();
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
    <>
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

      {/* 分享卡片弹窗 */}
      {showCard && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !saving && setShowCard(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowCard(false)}
              disabled={saving}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#5A5880] hover:text-[#3D3A5C] disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 卡片预览 */}
            <ShareCard
              ref={cardRef}
              temperament={result.temperament}
              temperamentScores={result.temperamentScores}
              abilityScores={result.abilityScores}
            />

            {/* 保存按钮 */}
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveImage}
              disabled={saving}
              className="w-full mt-4"
            >
              <Download className="w-4 h-4" />
              {saving ? t('shareCard.saving') : t('shareCard.saveImage')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
