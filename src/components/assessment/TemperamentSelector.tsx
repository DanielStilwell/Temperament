import { useState } from 'react';
import type { TemperamentType, AbilityDimension } from '../../types';

interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

interface TemperamentSelectorProps {
  onSelect: (evaluation: ComprehensiveEvaluation) => void;
}

const temperamentOptions: { id: TemperamentType; name: string; desc: string; color: string }[] = [
  { id: 'sanguine', name: '多血质', desc: '活泼外向、反应迅速', color: '#E8A87C' },
  { id: 'choleric', name: '胆汁质', desc: '果断热情、行动力强', color: '#D96459' },
  { id: 'phlegmatic', name: '黏液质', desc: '稳重安静、情绪稳定', color: '#6B9AC4' },
  { id: 'melancholic', name: '抑郁质', desc: '敏感细腻、思考深入', color: '#8E7CC3' },
];

const behaviorOptions = [
  { id: 'proactive', name: '积极主动', desc: '主动采取行动，不等待观望' },
  { id: 'rational', name: '理性分析', desc: '冷静思考，权衡利弊' },
  { id: 'collaborative', name: '沟通协作', desc: '寻求他人支持，共同解决' },
  { id: 'creative', name: '创新突破', desc: '尝试新方法，不拘泥常规' },
];

const abilityOptions: { id: AbilityDimension; name: string }[] = [
  { id: 'communication', name: '沟通力' },
  { id: 'leadership', name: '领导力' },
  { id: 'creativity', name: '创造力' },
  { id: 'analysis', name: '分析力' },
  { id: 'resilience', name: '抗压力' },
  { id: 'empathy', name: '同理心' },
];

const emotionOptions = [
  { id: 'positive', name: '正面积极', color: '#4CAF50' },
  { id: 'neutral', name: '中性客观', color: '#9E9E9E' },
  { id: 'negative', name: '消极回避', color: '#FF9800' },
  { id: 'anxious', name: '焦虑内耗', color: '#F44336' },
  { id: 'unknown', name: '不确定/难以判断', color: '#8E8CA8' },
];

export default function TemperamentSelector({ onSelect }: TemperamentSelectorProps) {
  const [temperament, setTemperament] = useState<TemperamentType | 'unknown' | null>(null);
  const [behaviors, setBehaviors] = useState<string[]>([]);
  const [abilities, setAbilities] = useState<AbilityDimension[]>([]);
  const [emotion, setEmotion] = useState<string | null>(null);

  const toggleBehavior = (id: string) => {
    setBehaviors(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const toggleAbility = (id: AbilityDimension) => {
    setAbilities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    if (temperament && emotion) {
      onSelect({
        temperament,
        behaviors,
        abilities,
        emotion,
      });
    }
  };

  const isValid = temperament && emotion;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-[440px] rounded-[24px] bg-white p-5 shadow-xl my-4">
        <h3 className="text-lg font-bold text-[#3D3A5C] mb-1">综合评价这个行为倾向</h3>
        <p className="text-sm text-[#8E8CA8] mb-4">请根据被观察者的真实情况进行判断</p>

        {/* 气质类型 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            气质类型 <span className="text-[#F44336]">*</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {temperamentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTemperament(opt.id)}
                className={`p-2.5 rounded-xl border-2 transition-all text-left ${
                  temperament === opt.id
                    ? 'border-[#5B4FCF] bg-[#5B4FCF]/5'
                    : 'border-[#E8E6F5] bg-white hover:border-[#C5C0E8]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.color }} />
                  <div>
                    <div className="text-sm font-semibold text-[#3D3A5C]">{opt.name}</div>
                    <div className="text-xs text-[#8E8CA8]">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 行为倾向 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            行为倾向 <span className="text-xs text-[#8E8CA8]">（可多选）</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {behaviorOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleBehavior(opt.id)}
                className={`p-2.5 rounded-xl border-2 transition-all text-left ${
                  behaviors.includes(opt.id)
                    ? 'border-[#5B4FCF] bg-[#5B4FCF]/5'
                    : 'border-[#E8E6F5] bg-white hover:border-[#C5C0E8]'
                }`}
              >
                <div className="text-sm font-medium text-[#3D3A5C]">{opt.name}</div>
                <div className="text-xs text-[#8E8CA8]">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 能力维度 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            突出能力 <span className="text-xs text-[#8E8CA8]">（可多选）</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {abilityOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleAbility(opt.id)}
                className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                  abilities.includes(opt.id)
                    ? 'border-[#5B4FCF] bg-[#5B4FCF] text-white'
                    : 'border-[#E8E6F5] bg-white text-[#5A5880] hover:border-[#C5C0E8]'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* 情绪态度 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            情绪态度 <span className="text-[#F44336]">*</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEmotion(opt.id)}
                className={`px-3 py-1.5 rounded-full border-2 text-sm transition-all ${
                  emotion === opt.id
                    ? 'border-[#5B4FCF] bg-[#5B4FCF] text-white'
                    : 'border-[#E8E6F5] bg-white text-[#5A5880] hover:border-[#C5C0E8]'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSelect({
              temperament: 'unknown',
              behaviors: [],
              abilities: [],
              emotion: 'unknown',
            })}
            className="flex-1 py-3 rounded-full border-2 border-[#E8E6F5] text-[#8E8CA8] font-semibold transition-all hover:bg-[#F5F3FF]"
          >
            跳过（自动分析）
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 py-3 rounded-full bg-[#5B4FCF] text-white font-semibold transition-all hover:bg-[#4B3FBF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            确认评价
          </button>
        </div>
      </div>
    </div>
  );
}