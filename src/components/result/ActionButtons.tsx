import { useNavigate } from 'react-router-dom';
import { RotateCcw, Share2, Save, X } from 'lucide-react';
import Button from '../ui/Button';
import useAssessmentStore from '../../stores/assessment';

export default function ActionButtons() {
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
      alert('链接已复制到剪贴板，可以分享给朋友');
    } catch {
      alert('分享功能暂不可用');
    }
  };

  // 管理者代填模式：保存被观察者到团队
  if (mode === 'observer') {
    const handleDiscard = () => {
      if (confirm('放弃保存此被观察者的测评结果？')) {
        reset();
        // 草稿里没有 tier 信息，按 profession 跳回工作台不太可行，统一回首页让用户重新进
        navigate('/');
      }
    };

    return (
      <div className="flex gap-3">
        <Button variant="outline" size="md" onClick={handleDiscard} className="flex-1">
          <X className="w-4 h-4" />
          放弃保存
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/save-observer')} className="flex-1">
          <Save className="w-4 h-4" />
          保存到团队
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button variant="outline" size="md" onClick={handleReset} className="flex-1">
        <RotateCcw className="w-4 h-4" />
        重新评估
      </Button>
      <Button variant="primary" size="md" onClick={handleShare} className="flex-1">
        <Share2 className="w-4 h-4" />
        分享结果
      </Button>
    </div>
  );
}
