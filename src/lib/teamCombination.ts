import type { TaskParams, Observer, TaskTeamConfig } from '../types/account';
import type { AbilityDimension, MotivationType, TemperamentType } from '../types';
import { predictTask } from '../data/prediction';

const ABILITY_KEYS: AbilityDimension[] = ['communication', 'leadership', 'creativity', 'analysis', 'resilience', 'empathy'];
const MOTIVATION_KEYS: MotivationType[] = ['achievement', 'affiliation', 'power', 'security'];

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

function matchScore(actual: number, required: number): number {
  if (actual >= required) return 100;
  const gap = required - actual;
  return clamp(100 - gap * 1.2);
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((s, n) => s + n, 0) / nums.length;
}

function observerThinkingScore(observer: Observer) {
  const t = observer.result.thinkingScores;
  return {
    proactive: clamp(50 + (t.proactive - t.reactive) / 2),
    rational: clamp(50 + (t.rational - t.emotional) / 2),
    collaborative: clamp(50 + (t.collaborative - t.independent) / 2),
    innovative: clamp(50 + (t.innovative - t.conventional) / 2),
  };
}

function scoreObserverForTask(ob: Observer, params: TaskParams): number {
  const obAbilityFit = mean(ABILITY_KEYS.map(k => matchScore(ob.result.abilityScores[k], params.abilities[k])));
  const obMotivationFit = mean(MOTIVATION_KEYS.map(k => matchScore(ob.result.motivationScores[k], params.motivations[k])));
  const ts = observerThinkingScore(ob);
  const obThinkingFit = mean((['proactive','rational','collaborative','innovative'] as const).map(k => matchScore(ts[k], params.thinking[k])));
  return Math.round(obAbilityFit * 0.5 + obMotivationFit * 0.25 + obThinkingFit * 0.25);
}

function topAbilityOf(ob: Observer, params: TaskParams): { key: AbilityDimension; score: number } {
  let best: { key: AbilityDimension; score: number } = { key: 'communication', score: 0 };
  for (const k of ABILITY_KEYS) {
    const contribution = ob.result.abilityScores[k] * (params.abilities[k] / 100);
    if (contribution > best.score) {
      best = { key: k, score: ob.result.abilityScores[k] };
    }
  }
  return best;
}

const ROLE_MAP: Record<string, AbilityDimension> = {
  leadership: 'leadership',
  communication: 'communication',
  analysis: 'analysis',
  creative: 'creativity',
  execution: 'resilience',
  resilience: 'resilience',
};

export interface CombinationMember {
  observerId: string;
  observerName: string;
  temperament: TemperamentType;
  roleKey: AbilityDimension;
  fitScore: number;
}

export interface TeamCombination {
  strategyKey: 'top-performers' | 'complementary' | 'role-based';
  memberIds: string[];
  members: CombinationMember[];
  synergyScore: number;
  completionProbability: number;
  rationaleParams: Record<string, string | number>;
  riskParams: Record<string, string | number>;
}

function determineTeamSize(params: TaskParams, maxAvailable: number): number {
  let size = 5;
  if (params.base.collaboration < 40) size = 3;
  else if (params.base.collaboration < 70) size = 4;
  return Math.min(size, maxAvailable, 6);
}

function buildTeamConfig(memberIds: string[]): TaskTeamConfig {
  return {
    selectedObserverIds: memberIds,
    minSize: 1,
    hasKeyRole: false,
    keyObserverId: null,
  };
}

function scoreCombination(
  params: TaskParams,
  memberIds: string[],
  allObservers: Observer[],
  strategyKey: TeamCombination['strategyKey'],
  rationaleParams: Record<string, string | number>,
  riskParams: Record<string, string | number>,
): TeamCombination | null {
  const members = memberIds.map(id => {
    const ob = allObservers.find(o => o.id === id)!;
    const fitScore = scoreObserverForTask(ob, params);
    const top = topAbilityOf(ob, params);
    return {
      observerId: ob.id,
      observerName: ob.name,
      temperament: ob.result.temperament,
      roleKey: top.key,
      fitScore,
    };
  });

  const prediction = predictTask(params, buildTeamConfig(memberIds), allObservers);

  return {
    strategyKey,
    memberIds,
    members,
    synergyScore: prediction.overallFit,
    completionProbability: prediction.completionProbability,
    rationaleParams,
    riskParams,
  };
}

function strategyTopPerformers(
  params: TaskParams,
  allObservers: Observer[],
  teamSize: number,
): TeamCombination | null {
  const scored = allObservers.map(ob => ({ ob, score: scoreObserverForTask(ob, params) }));
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, teamSize).map(s => s.ob.id);
  if (selected.length === 0) return null;

  const topName = scored[0].ob.name;
  const avgScore = Math.round(mean(scored.slice(0, teamSize).map(s => s.score)));

  return scoreCombination(params, selected, allObservers, 'top-performers',
    { topMember: topName, avgScore },
    { count: teamSize },
  );
}

function strategyComplementary(
  params: TaskParams,
  allObservers: Observer[],
  teamSize: number,
): TeamCombination | null {
  const scored = allObservers.map(ob => ({ ob, score: scoreObserverForTask(ob, params) }));
  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;

  const selected: string[] = [scored[0].ob.id];
  const usedTemperaments = new Set<TemperamentType>([scored[0].ob.result.temperament]);

  while (selected.length < teamSize) {
    let bestCandidate: { id: string; score: number } | null = null;

    for (const { ob } of scored) {
      if (selected.includes(ob.id)) continue;

      const currentTeam = ob ? [ob, ...selected.map(id => allObservers.find(o => o.id === id)!)] : [];
      const teamAvg: Record<AbilityDimension, number> = {} as any;
      for (const k of ABILITY_KEYS) {
        const vals = currentTeam.map(o => o.result.abilityScores[k]);
        teamAvg[k] = mean(vals);
      }

      let weakestGap = 0;
      let weakestKey: AbilityDimension = 'communication';
      for (const k of ABILITY_KEYS) {
        const gap = params.abilities[k] - teamAvg[k];
        if (gap > weakestGap) {
          weakestGap = gap;
          weakestKey = k;
        }
      }

      const candidateScore = ob.result.abilityScores[weakestKey];
      const diversityBonus = usedTemperaments.has(ob.result.temperament) ? 0 : 10;
      const totalScore = candidateScore + diversityBonus;

      if (!bestCandidate || totalScore > bestCandidate.score) {
        bestCandidate = { id: ob.id, score: totalScore };
      }
    }

    if (!bestCandidate) break;
    selected.push(bestCandidate.id);
    const ob = allObservers.find(o => o.id === bestCandidate!.id)!;
    usedTemperaments.add(ob.result.temperament);
  }

  if (selected.length < 2) return null;

  const temperamentCount = new Set(selected.map(id =>
    allObservers.find(o => o.id === id)!.result.temperament
  )).size;

  return scoreCombination(params, selected, allObservers, 'complementary',
    { diversity: temperamentCount },
    { count: selected.length },
  );
}

function strategyRoleBased(
  params: TaskParams,
  allObservers: Observer[],
  teamSize: number,
): TeamCombination | null {
  const taskTypes = params.base.types;
  const rolesNeeded = taskTypes.length > 0 ? taskTypes : ['leadership', 'communication'];

  const roleAbilities = rolesNeeded
    .map(t => ROLE_MAP[t] || 'leadership')
    .filter((v, i, a) => a.indexOf(v) === i);

  const selected: string[] = [];
  const usedTemperaments = new Set<TemperamentType>();

  for (const abilityKey of roleAbilities) {
    if (selected.length >= teamSize) break;
    let best: { id: string; score: number } | null = null;
    for (const ob of allObservers) {
      if (selected.includes(ob.id)) continue;
      const score = ob.result.abilityScores[abilityKey];
      const diversityBonus = usedTemperaments.has(ob.result.temperament) ? 0 : 5;
      const total = score + diversityBonus;
      if (!best || total > best.score) {
        best = { id: ob.id, score: total };
      }
    }
    if (best) {
      selected.push(best.id);
      const ob = allObservers.find(o => o.id === best!.id)!;
      usedTemperaments.add(ob.result.temperament);
    }
  }

  const scored = allObservers
    .filter(ob => !selected.includes(ob.id))
    .map(ob => ({ ob, score: scoreObserverForTask(ob, params) }))
    .sort((a, b) => b.score - a.score);

  for (const { ob } of scored) {
    if (selected.length >= teamSize) break;
    selected.push(ob.id);
  }

  if (selected.length < 2) return null;

  const roleCount = Math.min(roleAbilities.length, selected.length);

  return scoreCombination(params, selected, allObservers, 'role-based',
    { roleCount },
    { count: selected.length },
  );
}

export function recommendCombinations(
  params: TaskParams,
  allObservers: Observer[],
): TeamCombination[] {
  if (allObservers.length < 3) return [];

  const teamSize = determineTeamSize(params, allObservers.length);
  const combinations: TeamCombination[] = [];

  const top = strategyTopPerformers(params, allObservers, teamSize);
  if (top) combinations.push(top);

  const comp = strategyComplementary(params, allObservers, teamSize);
  if (comp) {
    const isDuplicate = combinations.some(c =>
      c.memberIds.length === comp.memberIds.length &&
      c.memberIds.every(id => comp.memberIds.includes(id))
    );
    if (!isDuplicate) combinations.push(comp);
  }

  const role = strategyRoleBased(params, allObservers, teamSize);
  if (role) {
    const isDuplicate = combinations.some(c =>
      c.memberIds.length === role.memberIds.length &&
      c.memberIds.every(id => role.memberIds.includes(id))
    );
    if (!isDuplicate) combinations.push(role);
  }

  combinations.sort((a, b) => b.synergyScore - a.synergyScore);
  return combinations.slice(0, 3);
}
