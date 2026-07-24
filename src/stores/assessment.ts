import { create } from 'zustand';
import type { AssessmentResult, ProfessionType, Scenario, TemperamentType, AbilityDimension, DimensionWeights } from '../types';
import { getScenarios } from '../data/scenarioMap';
import { calculateScores } from '../data/scoring';
import type { Gender } from '../types/account';

// 综合评价结构
interface ComprehensiveEvaluation {
  temperament: TemperamentType | 'unknown';
  behaviors: string[];
  abilities: AbilityDimension[];
  emotion: string;
}

// 自定义选项的完整评价（包含权重）
interface CustomEvaluation {
  text: string;
  evaluation: ComprehensiveEvaluation;
  weights: DimensionWeights;
}

// 评估模式
export type AssessmentMode = 'free' | 'observer';

// 被观察者草稿（管理者代填时使用）
export interface ObserverDraft {
  name: string;
  gender: Gender;
  note: string;
}

interface AssessmentState {
  profession: ProfessionType | null;
  answers: Record<number, string[]>;
  customAnswers: Record<number, string>; // 存储自定义选项的文本
  customEvaluations: Record<number, CustomEvaluation>; // 存储自定义选项的完整评价
  currentIndex: number;
  result: AssessmentResult | null;
  // 管理者代填模式相关
  mode: AssessmentMode;
  observerDraft: ObserverDraft | null;
  setProfession: (profession: ProfessionType) => void;
  setAnswer: (scenarioId: number, optionId: string) => void;
  setCustomAnswer: (scenarioId: number, customText: string, evaluation: ComprehensiveEvaluation, weights: DimensionWeights) => void;
  goToNext: () => void;
  goToPrev: () => void;
  completeAssessment: () => void;
  reset: () => void;
  getScenarios: () => Scenario[];
  // 管理者代填模式
  startObserverMode: (profession: ProfessionType, draft: ObserverDraft) => void;
  clearObserverDraft: () => void;
}

const useAssessmentStore = create<AssessmentState>((set, get) => ({
  profession: null,
  answers: {},
  customAnswers: {},
  customEvaluations: {},
  currentIndex: 0,
  result: null,
  mode: 'free',
  observerDraft: null,

  setProfession: (profession) => {
    set({ profession, answers: {}, customAnswers: {}, customEvaluations: {}, currentIndex: 0, result: null });
  },

  getScenarios: () => {
    return getScenarios(get().profession);
  },

  setAnswer: (scenarioId, optionId) => {
    set((state) => {
      const current = state.answers[scenarioId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { answers: { ...state.answers, [scenarioId]: next } };
    });
  },

  setCustomAnswer: (scenarioId, customText, evaluation, weights) => {
    set((state) => ({
      customAnswers: { ...state.customAnswers, [scenarioId]: customText },
      customEvaluations: {
        ...state.customEvaluations,
        [scenarioId]: { text: customText, evaluation, weights },
      },
      answers: {
        ...state.answers,
        [scenarioId]: ['custom'],
      },
    }));
  },

  goToNext: () => {
    const { currentIndex } = get();
    const scenarios = getScenarios(get().profession);
    if (currentIndex < scenarios.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  goToPrev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  completeAssessment: () => {
    const { answers, customEvaluations, profession } = get();
    const scenarios = getScenarios(profession);
    const result = calculateScores(answers, scenarios, customEvaluations);
    set({ result });
  },

  reset: () => {
    set({ profession: null, answers: {}, customAnswers: {}, customEvaluations: {}, currentIndex: 0, result: null, mode: 'free', observerDraft: null });
  },

  startObserverMode: (profession, draft) => {
    set({
      profession,
      answers: {},
      customAnswers: {},
      customEvaluations: {},
      currentIndex: 0,
      result: null,
      mode: 'observer',
      observerDraft: draft,
    });
  },

  clearObserverDraft: () => {
    set({ mode: 'free', observerDraft: null });
  },
}));

export default useAssessmentStore;