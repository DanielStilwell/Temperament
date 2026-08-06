-- ======================================================================
-- Temperament App - Supabase 数据库 Schema
-- 使用方法：登录 Supabase 控制台 → SQL Editor → 粘贴本文件 → Run
-- ======================================================================

-- ----------------------------------------------------------------------
-- 0. 扩展
-- ----------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------
-- 1. profiles 表（扩展 auth.users，保存账号版本与支付状态）
-- ----------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  nickname        text not null default '',
  tier            text not null default 'free' check (tier in ('free','pro','max')),
  payment_status  text not null default 'none' check (payment_status in ('none','pending','paid')),
  paid_at         timestamptz,
  tier_expires_at timestamptz,  -- 订阅过期时间（年度订阅 = 支付成功时间 + 1 年；free 永远为 null）
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------
-- 2. observers 表（账号下保存的被观察者及完整测评结果）
-- ----------------------------------------------------------------------
create table if not exists public.observers (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  gender        text not null default 'unknown' check (gender in ('male','female','other','unknown')),
  profession    text not null default '',
  result_json   jsonb not null default '{}'::jsonb,
  answers_json  jsonb not null default '{}'::jsonb,
  note          text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists observers_owner_id_idx on public.observers(owner_id);

-- ----------------------------------------------------------------------
-- 3. tasks 表（Max 版任务预判记录）
-- ----------------------------------------------------------------------
create table if not exists public.tasks (
  id                    uuid primary key default gen_random_uuid(),
  owner_id              uuid not null references auth.users(id) on delete cascade,
  name                  text not null,
  params_json           jsonb not null default '{}'::jsonb,
  selected_observer_ids uuid[] not null default '{}',
  prediction_json       jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists tasks_owner_id_idx on public.tasks(owner_id);

-- ----------------------------------------------------------------------
-- 4. updated_at 触发器
-- ----------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists observers_set_updated_at on public.observers;
create trigger observers_set_updated_at
  before update on public.observers
  for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------
-- 5. 新用户注册时自动创建 profiles 行
-- ----------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_intended_tier text;
begin
  v_intended_tier := new.raw_user_meta_data->>'intended_tier';
  insert into public.profiles (id, nickname, tier, payment_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', ''),
    case when v_intended_tier in ('pro','max') then v_intended_tier else 'free' end,
    case when v_intended_tier in ('pro','max') then 'pending' else 'none' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------
-- 6. 行级安全策略（RLS）
-- ----------------------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.observers  enable row level security;
alter table public.tasks      enable row level security;

-- profiles：用户只能读写自己的档案
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- profiles_update_own 已移至第 9 节（收紧后）

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- observers：用户只能 CRUD 自己拥有的观察者
drop policy if exists "observers_select_own" on public.observers;
create policy "observers_select_own" on public.observers
  for select using (auth.uid() = owner_id);

drop policy if exists "observers_insert_own" on public.observers;
create policy "observers_insert_own" on public.observers
  for insert with check (auth.uid() = owner_id);

drop policy if exists "observers_update_own" on public.observers;
create policy "observers_update_own" on public.observers
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "observers_delete_own" on public.observers;
create policy "observers_delete_own" on public.observers
  for delete using (auth.uid() = owner_id);

-- tasks：用户只能 CRUD 自己创建的任务
drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = owner_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = owner_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = owner_id);

-- ----------------------------------------------------------------------
-- 7. 观察者数量上限校验（Pro=60, Max=160）
-- 通过触发器在插入时校验
-- ----------------------------------------------------------------------
create or replace function public.check_observer_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  current_tier text;
  current_count int;
  max_limit int;
begin
  select tier into current_tier from public.profiles where id = new.owner_id;
  if current_tier = 'pro' then
    max_limit := 60;
  elseif current_tier = 'max' then
    max_limit := 160;
  else
    max_limit := 0;  -- free 用户不允许保存观察者
  end if;

  select count(*) into current_count from public.observers where owner_id = new.owner_id;

  if current_count >= max_limit then
    raise exception '已达观察者数量上限（%）。如需更多容量，请升级版本。', max_limit;
  end if;

  return new;
end;
$$;

drop trigger if exists observers_check_limit on public.observers;
create trigger observers_check_limit
  before insert on public.observers
  for each row execute function public.check_observer_limit();

-- ----------------------------------------------------------------------
-- 8. payment_orders 表（跟踪连连国际支付订单）
-- ----------------------------------------------------------------------
create table if not exists public.payment_orders (
  id                      text primary key,  -- merchant_transaction_id
  user_id                 uuid not null references auth.users(id) on delete cascade,
  tier                    text not null,      -- 目标 tier (pro/max)
  amount                  numeric not null,   -- 支付金额
  billing_period          text not null default 'yearly' check (billing_period in ('monthly','6months','yearly')),
  is_upgrade              boolean not null default false,
  upgrade_from            text,               -- 升级来源 tier
  status                  text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  lianlian_order_id       text,               -- 连连返回的 order_id
  lianlian_payment_status text,               -- 连连返回的 payment_status
  creem_checkout_id       text,               -- Creem checkout session ID
  paid_at                 timestamptz,
  -- 退款相关字段
  refund_status           text default null check (refund_status in (null,'pending','refunded','failed')),
  refund_amount           numeric,
  merchant_refund_id      text,               -- 我方生成的退款单号
  lianlian_refund_id      text,               -- 连连返回的 refund_id
  refund_reason           text,
  refund_requested_at     timestamptz,
  refunded_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);

alter table public.payment_orders enable row level security;

-- payment_orders：用户只能查看自己的订单
drop policy if exists "payment_orders_select_own" on public.payment_orders;
create policy "payment_orders_select_own" on public.payment_orders
  for select using (auth.uid() = user_id);

-- payment_orders：INSERT/UPDATE 仅通过 service_role (Edge Function)
-- 不允许前端直接 insert/update，RLS 默认无 policy 即拒绝

drop trigger if exists payment_orders_set_updated_at on public.payment_orders;
create trigger payment_orders_set_updated_at
  before update on public.payment_orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------
-- 9. 收紧 profiles RLS：前端不能直接更新 tier/payment_status
--    tier 更新只能通过 Edge Function (service_role) 在 webhook 验签后执行
-- ----------------------------------------------------------------------

-- 替换原有的 profiles_update_own：只允许更新 nickname 等非支付字段
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- 不允许前端修改 tier / payment_status / tier_expires_at，这些字段由 Edge Function 更新
    and tier = (select tier from public.profiles where id = auth.uid())
    and payment_status = (select payment_status from public.profiles where id = auth.uid())
    and tier_expires_at is not distinct from (select tier_expires_at from public.profiles where id = auth.uid())
  );
