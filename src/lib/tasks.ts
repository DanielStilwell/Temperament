import { supabase } from './supabase';
import type { TaskRecord, TaskParams, TaskTeamConfig, TaskPrediction } from '../types/account';

function mapTask(row: any): TaskRecord {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    params: row.params_json,
    teamConfig: {
      selectedObserverIds: row.selected_observer_ids ?? [],
      minSize: 1,
      hasKeyRole: false,
      keyObserverId: null,
    },
    prediction: row.prediction_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listTasks(): Promise<TaskRecord[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[listTasks]', error);
    throw error;
  }
  return (data ?? []).map(mapTask);
}

export async function createTask(params: {
  name: string;
  taskParams: TaskParams;
  teamConfig: TaskTeamConfig;
  prediction: TaskPrediction;
}): Promise<TaskRecord> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      owner_id: user.id,
      name: params.name,
      params_json: params.taskParams,
      selected_observer_ids: params.teamConfig.selectedObserverIds,
      prediction_json: params.prediction,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[createTask]', error);
    throw error;
  }
  return mapTask(data);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    console.error('[deleteTask]', error);
    throw error;
  }
}
