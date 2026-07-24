import { supabase } from './supabase';
import type { Observer } from '../types/account';
import type { AssessmentResult, ProfessionType } from '../types';
import type { Gender } from '../types/account';

// 把数据库行映射为前端 Observer
function mapObserver(row: any): Observer {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    gender: row.gender as Gender,
    profession: (row.profession || '') as ProfessionType | '',
    result: row.result_json as AssessmentResult,
    answers: row.answers_json ?? {},
    note: row.note ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listObservers(): Promise<Observer[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('observers')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[listObservers]', error);
    throw error;
  }
  return (data ?? []).map(mapObserver);
}

export async function createObserver(params: {
  name: string;
  gender: Gender;
  profession: ProfessionType;
  result: AssessmentResult;
  answers: Record<number, string[]>;
  note?: string;
}): Promise<Observer> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('未登录');

  const { data, error } = await supabase
    .from('observers')
    .insert({
      owner_id: user.id,
      name: params.name,
      gender: params.gender,
      profession: params.profession,
      result_json: params.result,
      answers_json: params.answers,
      note: params.note ?? '',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[createObserver]', error);
    throw error;
  }
  return mapObserver(data);
}

export async function updateObserver(
  id: string,
  patch: Partial<Pick<Observer, 'name' | 'gender' | 'note'>>
): Promise<void> {
  const update: any = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.gender !== undefined) update.gender = patch.gender;
  if (patch.note !== undefined) update.note = patch.note;

  const { error } = await supabase.from('observers').update(update).eq('id', id);
  if (error) {
    console.error('[updateObserver]', error);
    throw error;
  }
}

export async function deleteObserver(id: string): Promise<void> {
  const { error } = await supabase.from('observers').delete().eq('id', id);
  if (error) {
    console.error('[deleteObserver]', error);
    throw error;
  }
}
