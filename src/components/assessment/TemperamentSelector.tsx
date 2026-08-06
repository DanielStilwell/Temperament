import { useState } from 'react';
import type { TemperamentType, AbilityDimension } from '../../types';
import { useTranslation } from 'react-i18next';

interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

interface TemperamentSelectorProps {
  onSelect: (evaluation: ComprehensiveEvaluation) => void;
}

const temperamentOptions: { id: TemperamentType; color: string }[] = [
  { id: 'sanguine', color: '#E8A87C' },
  { id: 'choleric', color: '#D96459' },
  { id: 'phlegmatic', color: '#6B9AC4' },
  { id: 'melancholic', color: '#8E7CC3' },
];

const behaviorOptions = [
  { id: 'proactive' },
  { id: 'rational' },
  { id: 'collaborative' },
  { id: 'creative' },
];

const abilityOptions: { id: AbilityDimension }[] = [
  { id: 'communication' },
  { id: 'leadership' },
  { id: 'creativity' },
  { id: 'analysis' },
  { id: 'resilience' },
  { id: 'empathy' },
];

const emotionOptions = [
  { id: 'positive', color: '#4CAF50' },
  { id: 'neutral', color: '#9E9E9E' },
  { id: 'negative', color: '#FF9800' },
  { id: 'anxious', color: '#F44336' },
  { id: 'unknown', color: '#8E8CA8' },
];

export default function TemperamentSelector({ onSelect }: TemperamentSelectorProps) {
  const { t } = useTranslation();
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
        <h3 className="text-lg font-bold text-[#3D3A5C] mb-1">{t('assessment.selectorTitle')}</h3>
        <p className="text-sm text-[#8E8CA8] mb-4">{t('assessment.selectorHint')}</p>

        {/* 气质类型 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            {t('assessment.temperamentType')} <span className="text-[#F44336]">*</span>
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
                    <div className="text-sm font-semibold text-[#3D3A5C]">{t(`temperament.${opt.id}.name`)}</div>
                    <div className="text-xs text-[#8E8CA8]">{t(`temperament.${opt.id}.desc`)}</div>
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
            {t('assessment.behavioralTendency')} <span className="text-xs text-[#8E8CA8]">(multiple)</span>
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
                <div className="text-sm font-medium text-[#3D3A5C]">{t(`behaviors.${opt.id}`)}</div>
                <div className="text-xs text-[#8E8CA8]">{t(`behaviors.${opt.id}Desc`)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 能力维度 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            {t('assessment.keyAbilities')} <span className="text-xs text-[#8E8CA8]">(multiple)</span>
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
                {t(`abilities.${opt.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* 情绪态度 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            {t('assessment.emotionalTone')} <span className="text-[#F44336]">*</span>
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
                {t(`emotions.${opt.id}`)}
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
            {t('assessment.skipAuto')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 py-3 rounded-full bg-[#5B4FCF] text-white font-semibold transition-all hover:bg-[#4B3FBF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('assessment.selectorConfirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
