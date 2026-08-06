import type { ScenarioOption, TemperamentType, AbilityDimension } from '../../types';
import OptionItem from './OptionItem';
import CustomOptionItem from './CustomOptionItem';

interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

interface OptionListProps {
  options: ScenarioOption[];
  selectedOptionIds: string[];
  customText: string;
  profession: string;
  scenarioId: number;
  onSelect: (optionId: string) => void;
  onCustomSelect: (customText: string, evaluation: ComprehensiveEvaluation) => void;
}

export default function OptionList({ options, selectedOptionIds, customText, profession, scenarioId, onSelect, onCustomSelect }: OptionListProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, i) => (
        <OptionItem
          key={option.id}
          option={option}
          index={i}
          profession={profession}
          scenarioId={scenarioId}
          isSelected={selectedOptionIds.includes(option.id)}
          onSelect={onSelect}
        />
      ))}
      <CustomOptionItem
        isSelected={selectedOptionIds.includes('custom')}
        customText={customText}
        onSelect={onCustomSelect}
      />
    </div>
  );
}
