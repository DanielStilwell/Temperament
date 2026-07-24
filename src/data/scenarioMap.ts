import type { Scenario, ProfessionType } from '../types';
import serviceScenarios from './scenarios/service';
import studentScenarios from './scenarios/student';
import officeScenarios from './scenarios/office';
import civilScenarios from './scenarios/civil';
import artistScenarios from './scenarios/artist';
import mediaScenarios from './scenarios/media';
import teacherScenarios from './scenarios/teacher';
import doctorScenarios from './scenarios/doctor';
import defaultScenarios from './scenarios';

export const scenarioMap: Record<ProfessionType, Scenario[]> = {
  service: serviceScenarios,
  student: studentScenarios,
  office: officeScenarios,
  civil: civilScenarios,
  artist: artistScenarios,
  media: mediaScenarios,
  teacher: teacherScenarios,
  doctor: doctorScenarios,
};

export function getScenarios(profession: ProfessionType | null): Scenario[] {
  if (profession && scenarioMap[profession]) {
    return scenarioMap[profession];
  }
  return defaultScenarios;
}