import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssessmentStore from '../stores/assessment';
import ProgressBar from '../components/assessment/ProgressBar';
import ScenarioCard from '../components/assessment/ScenarioCard';
import OptionList from '../components/assessment/OptionList';
import NavigationBar from '../components/assessment/NavigationBar';
import { analyzeTemperamentFromText, getWeightsFromEvaluation } from '../data/keywordMatching';
import type { TemperamentType, AbilityDimension, DimensionWeights } from '../types';

// 综合评价结构
interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

export default function AssessmentPage() {
  const navigate = useNavigate();
  const {
    answers,
    customAnswers,
    currentIndex,
    profession,
    result,
    setAnswer,
    setCustomAnswer,
    goToNext,
    goToPrev,
    getScenarios,
  } = useAssessmentStore();

  const scenarios = getScenarios();

  // 如果没有选择职业，返回首页
  useEffect(() => {
    if (!profession) {
      navigate('/');
    }
  }, [profession, navigate]);

  // 如果已有结果，跳转到结果页
  useEffect(() => {
    if (result) {
      navigate('/result');
    }
  }, [result, navigate]);

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8E8CA8]">
        Loading...
      </div>
    );
  }

  const scenario = scenarios[currentIndex];
  const selectedOptionIds = answers[scenario.id] ?? [];
  const customText = customAnswers[scenario.id] ?? '';

  const handleSelect = (optionId: string) => {
    setAnswer(scenario.id, optionId);
  };

  const handleCustomSelect = (text: string, evaluation: ComprehensiveEvaluation) => {
    // 如果用户选择"跳过"（temperament为'unknown'），使用关键词匹配
    if (evaluation.temperament === 'unknown') {
      const detectedTemperament = analyzeTemperamentFromText(text);
      // 为自动分析生成默认权重
      const weights = getWeightsFromEvaluation(detectedTemperament, [], [], 'neutral');
      setCustomAnswer(scenario.id, text, { ...evaluation, temperament: detectedTemperament }, weights);
    } else {
      // 用户手动评价，根据评价生成权重
      const weights = getWeightsFromEvaluation(
        evaluation.temperament,
        evaluation.behaviors,
        evaluation.abilities,
        evaluation.emotion
      );
      setCustomAnswer(scenario.id, text, evaluation, weights);
    }
  };

  const handleNext = () => {
    if (currentIndex === scenarios.length - 1) {
      // 最后一题，完成评估
      useAssessmentStore.getState().completeAssessment();
      navigate('/result');
    } else {
      goToNext();
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8E8CA8]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[640px] xl:max-w-[720px] flex flex-col gap-5">
        <ProgressBar current={currentIndex} total={scenarios.length} />

        <ScenarioCard situation={scenario.situation} index={currentIndex} />

        <OptionList
          options={scenario.options}
          selectedOptionIds={selectedOptionIds}
          customText={customText}
          onSelect={handleSelect}
          onCustomSelect={handleCustomSelect}
        />

        <NavigationBar
          onPrev={goToPrev}
          onNext={handleNext}
          canGoPrev={currentIndex > 0}
          canGoNext={true}
          isLast={currentIndex === scenarios.length - 1}
          hasSelected={selectedOptionIds.length > 0}
        />
      </div>
    </div>
  );
}