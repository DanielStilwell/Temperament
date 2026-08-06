import { useTranslation } from 'react-i18next';

interface ScenarioCardProps {
  profession: string;
  scenarioId: number;
  index: number;
}

export default function ScenarioCard({ profession, scenarioId, index }: ScenarioCardProps) {
  const { t } = useTranslation();
  const situation = t(`scenarios.${profession}.${scenarioId}.situation`);

  return (
    <div className="rounded-[20px] bg-gradient-to-br from-[#F5F3FF] to-[#EDEAFA] border border-[#E0DCF5] p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5B4FCF]/10 flex items-center justify-center text-sm font-semibold text-[#5B4FCF]">
          {index + 1}
        </div>
        <p className="text-[15px] leading-[1.7] text-[#3D3A5C]">{situation}</p>
      </div>
    </div>
  );
}
