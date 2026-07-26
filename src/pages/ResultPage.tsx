import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssessmentStore from '../stores/assessment';
import Disclaimer from '../components/ui/Disclaimer';
import TemperamentHero from '../components/result/TemperamentHero';
import RadarChart from '../components/result/RadarChart';
import DimensionDetails from '../components/result/DimensionDetails';
import MotivationAnalysis from '../components/result/MotivationAnalysis';
import ThinkingAnalysis from '../components/result/ThinkingAnalysis';
import ActionButtons from '../components/result/ActionButtons';

export default function ResultPage() {
  const navigate = useNavigate();
  const result = useAssessmentStore((s) => s.result);

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8E8CA8]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-8">
      <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[640px] xl:max-w-[720px] flex flex-col gap-5">
        <TemperamentHero
          temperament={result.temperament}
          temperamentScores={result.temperamentScores}
          abilityScores={result.abilityScores}
        />

        <RadarChart scores={result.abilityScores} />

        <DimensionDetails scores={result.abilityScores} />

        <MotivationAnalysis scores={result.motivationScores} />

        <ThinkingAnalysis scores={result.thinkingScores} />

        <Disclaimer />

        <ActionButtons />
      </div>
    </div>
  );
}