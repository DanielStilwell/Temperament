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
  const [previewUrl, setPreviewUrl] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    reset();
    navigate('/assessment');
  };

  const handleShare = () => {
    setPreviewUrl('');
    setShowCard(true);
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setPreviewUrl('');
    try {
      // 等待字体加载
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: false,
        skipFonts: true,
        backgroundColor: '#ffffff',
      });

      console.log('Share card generated, size:', Math.round(dataUrl.length / 1024), 'KB');

      // 显示预览图
      setPreviewUrl(dataUrl);

      // 尝试系统分享（移动端）
      if (navigator.share && navigator.canShare) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], 'tempe-result.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Tempe',
              text: t('shareCard.shareText'),
            });
            return;
          }
        } catch (shareErr) {
          // 用户取消分享或分享失败，继续走下载
        }
      }

      // 下载：必须将 <a> 挂载到 DOM 才能触发浏览器下载
      const link = document.createElement('a');
      link.download = 'tempe-result.png';
      link.href = dataUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      // 延迟移除，确保下载请求已发出
      setTimeout(() => document.body.removeChild(link), 200);
    } catch (err) {
      console.error('Share card save error:', err);
      alert(t('shareCard.saveFail'));
    } finally {
      setSaving(false);
    }
  };

  // 管理者代填模式
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
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50"
          onClick={() => !saving && setShowCard(false)}
        >
          <div className="relative my-8" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowCard(false)}
              disabled={saving}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#5A5880] hover:text-[#3D3A5C] disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 卡片预览（生成图片的源 DOM） */}
            {!previewUrl && (
              <ShareCard
                ref={cardRef}
                temperament={result.temperament}
                temperamentScores={result.temperamentScores}
                abilityScores={result.abilityScores}
              />
            )}

            {/* 生成的 PNG 预览 */}
            {previewUrl && (
              <div className="w-[375px]">
                <img
                  src={previewUrl}
                  alt="Share Card"
                  className="w-full rounded-[28px] shadow-2xl"
                />
              </div>
            )}

            {/* 操作按钮 */}
            <div className="w-[375px] mt-4 flex gap-2">
              {!previewUrl && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveImage}
                  disabled={saving}
                  className="flex-1"
                >
                  <Download className="w-4 h-4" />
                  {saving ? t('shareCard.saving') : t('shareCard.saveImage')}
                </Button>
              )}

              {previewUrl && (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setPreviewUrl('')}
                    className="flex-1"
                  >
                    {t('shareCard.regenerate')}
                  </Button>
                  <a
                    href={previewUrl}
                    download="tempe-result.png"
                    className="flex-1"
                  >
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <Download className="w-4 h-4" />
                      {t('shareCard.download')}
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
