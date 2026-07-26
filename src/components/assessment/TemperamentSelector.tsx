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
  { id: 'sanguine', name: 'Sanguine', desc: 'Sociable, quick response', color: '#E8A87C' },
  { id: 'choleric', name: 'Choleric', desc: 'Decisive, strong drive', color: '#D96459' },
  { id: 'phlegmatic', name: 'Phlegmatic', desc: 'Calm, emotionally stable', color: '#6B9AC4' },
  { id: 'melancholic', name: 'Melancholic', desc: 'Sensitive, deep thinker', color: '#8E7CC3' },
];

const behaviorOptions = [
  { id: 'proactive', name: 'Proactive', desc: 'Takes initiative, not waiting' },
  { id: 'rational', name: 'Rational Analysis', desc: 'Calm thinking, weighing pros & cons' },
  { id: 'collaborative', name: 'Collaborative', desc: 'Seeks support, solves together' },
  { id: 'creative', name: 'Innovative', desc: 'Tries new methods, breaks conventions' },
];

const abilityOptions: { id: AbilityDimension; name: string }[] = [
  { id: 'communication', name: 'Communication' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'creativity', name: 'Creativity' },
  { id: 'analysis', name: 'Analysis' },
  { id: 'resilience', name: 'Resilience' },
  { id: 'empathy', name: 'Empathy' },
];

const emotionOptions = [
  { id: 'positive', name: 'Positive', color: '#4CAF50' },
  { id: 'neutral', name: 'Neutral', color: '#9E9E9E' },
  { id: 'negative', name: 'Negative/Avoidant', color: '#FF9800' },
  { id: 'anxious', name: 'Anxious', color: '#F44336' },
  { id: 'unknown', name: 'Uncertain', color: '#8E8CA8' },
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
        <h3 className="text-lg font-bold text-[#3D3A5C] mb-1">Evaluate this behavioral tendency</h3>
        <p className="text-sm text-[#8E8CA8] mb-4">Judge based on the observer's real situation</p>

        {/* 气质类型 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#5A5880] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FCF]" />
            Temperament Type <span className="text-[#F44336]">*</span>
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
            Behavioral Tendency <span className="text-xs text-[#8E8CA8]">(multiple)</span>
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
            Key Abilities <span className="text-xs text-[#8E8CA8]">(multiple)</span>
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
            Emotional Tone <span className="text-[#F44336]">*</span>
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
            Skip (auto-analyze)
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 py-3 rounded-full bg-[#5B4FCF] text-white font-semibold transition-all hover:bg-[#4B3FBF] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
