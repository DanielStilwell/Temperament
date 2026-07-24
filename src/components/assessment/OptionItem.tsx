import type { ScenarioOption } from '../../types';

interface OptionItemProps {
  option: ScenarioOption;
  index: number;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default function OptionItem({ option, index, isSelected, onSelect }: OptionItemProps) {
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-start gap-3 group ${
        isSelected
          ? 'border-[#5B4FCF] bg-[#5B4FCF]/5 shadow-[0_0_0_1px_rgba(91,79,207,0.2)]'
          : 'border-[#E8E6F5] bg-white/50 hover:border-[#C5C0E8] hover:bg-white/80'
      }`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold transition-all duration-300 ${
          isSelected
            ? 'bg-[#5B4FCF] text-white'
            : 'bg-[#F0EEF8] text-[#8E8CA8] group-hover:bg-[#E0DCF5]'
        }`}
      >
        {optionLabels[index]}
      </div>
      <span
        className={`text-[15px] leading-[1.6] flex-1 ${
          isSelected ? 'text-[#3D3A5C] font-medium' : 'text-[#6B6990]'
        }`}
      >
        {option.text}
      </span>
    </button>
  );
}