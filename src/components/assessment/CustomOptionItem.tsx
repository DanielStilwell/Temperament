import { useState } from 'react';
import type { TemperamentType, AbilityDimension } from '../../types';
import TemperamentSelector from './TemperamentSelector';

interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

interface CustomOptionItemProps {
  isSelected: boolean;
  customText: string;
  onSelect: (customText: string, evaluation: ComprehensiveEvaluation) => void;
}

export default function CustomOptionItem({ isSelected, customText, onSelect }: CustomOptionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(customText);
  const [showTemperamentSelector, setShowTemperamentSelector] = useState(false);

  const handleClick = () => {
    if (!isSelected) {
      setIsEditing(true);
    }
  };

  const handleConfirm = () => {
    if (inputValue.trim()) {
      setIsEditing(false);
      setShowTemperamentSelector(true);
    }
  };

  const handleCancel = () => {
    setInputValue(customText);
    setIsEditing(false);
  };

  const handleEvaluationSelect = (evaluation: ComprehensiveEvaluation) => {
    setShowTemperamentSelector(false);
    onSelect(inputValue.trim(), evaluation);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleClick}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-start gap-3 group ${
            isSelected && !isEditing
              ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 shadow-[0_0_0_1px_rgba(91,79,207,0.2)]'
              : 'border-[#E8E6F5] bg-white/50 hover:border-[#C5C0E8] hover:bg-white/80'
          }`}
        >
          <div
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold transition-all duration-300 ${
              isSelected && !isEditing
                ? 'bg-[#5B4FCF] text-white'
                : 'bg-[#F0EEF8] text-[#8E8CA8] group-hover:bg-[#E0DCF5]'
            }`}
          >
            ✎
          </div>
          <span
            className={`text-[15px] leading-[1.6] flex-1 ${
              isSelected && !isEditing ? 'text-[#3D3A5C] font-medium' : 'text-[#6B6990]'
            }`}
          >
            {isSelected && customText ? customText : 'Other (describe the real situation)'}
          </span>
        </button>

        {isEditing && (
          <div className="flex flex-col gap-2 pl-10">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe the observer's actual reaction..."
              className="w-full p-3 rounded-xl border-2 border-[#E8E6F5] bg-white/50 text-[15px] leading-[1.6] text-[#3D3A5C] resize-none focus:outline-none focus:border-[#5B4FCF] transition-all"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm text-[#8E8CA8] border border-[#E8E6F5] bg-white/50 hover:bg-[#F5F3FF] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!inputValue.trim()}
                className="px-4 py-2 rounded-lg text-sm text-white bg-[#5B4FCF] hover:bg-[#4B3FBF] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      {showTemperamentSelector && (
        <TemperamentSelector onSelect={handleEvaluationSelect} />
      )}
    </>
  );
}