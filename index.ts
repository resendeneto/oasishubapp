-- ===== OASIS HUB :: RLS & POLICIES =====
create or replace function public.is_adm()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'adm');
$$;

create or replace function public.my_oasico_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.oasicos where profile_id = auth.uid() limit 1;
$$;

-- habilita RLS
alter table public.profiles enable row level security;
alter table public.oasicos enable row level security;
alter table public.ioe_responses enable row level security;
alter table public.ioe_pillar_scores enable row level security;
alter table public.ioe_answers enable row level security;
alter table public.life_wheel_responses enable row level security;
alter table public.life_wheel_scores enable row level security;
alter table public.business_wheel_responses enable row level security;
alter table public.business_wheel_scores enable row level security;
alter table public.mentoring_sessions enable row level security;
alter table public.mentoring_private enable row level security;
alter table public.tasks enable row level security;
alter table public.group_events enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

-- PROFILES
create policy profiles_select on public.profiles for select using (id = auth.uid() or public.is_adm());
create policy profiles_update on public.profiles for update using (id = auth.uid() or public.is_adm());

-- OASICOS
create policy oasicos_select on public.oasicos for select using (public.is_adm() or profile_id = auth.uid());
create policy oasicos_insert on public.oasicos for insert with check (public.is_adm());
create policy oasicos_update on public.oasicos for update using (public.is_adm() or profile_id = auth.uid());
create policy oasicos_delete on public.oasicos for delete using (public.is_adm());

-- IOE
create policy ioe_resp_select on public.ioe_responses for select using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy ioe_resp_insert on public.ioe_responses for insert with check (public.is_adm() or oasico_id = public.my_oasico_id());
create policy ioe_pillar_all on public.ioe_pillar_scores for all
  using (exists (select 1 from public.ioe_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())))
  with check (exists (select 1 from public.ioe_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())));
create policy ioe_answers_all on public.ioe_answers for all
  using (exists (select 1 from public.ioe_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())))
  with check (exists (select 1 from public.ioe_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())));

-- WHEELS
create policy lifew_resp_sel on public.life_wheel_responses for select using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy lifew_resp_ins on public.life_wheel_responses for insert with check (public.is_adm() or oasico_id = public.my_oasico_id());
create policy lifew_score_all on public.life_wheel_scores for all
  using (exists (select 1 from public.life_wheel_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())))
  with check (exists (select 1 from public.life_wheel_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())));
create policy bizw_resp_sel on public.business_wheel_responses for select using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy bizw_resp_ins on public.business_wheel_responses for insert with check (public.is_adm() or oasico_id = public.my_oasico_id());
create policy bizw_score_all on public.business_wheel_scores for all
  using (exists (select 1 from public.business_wheel_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())))
  with check (exists (select 1 from public.business_wheel_responses r where r.id = response_id and (public.is_adm() or r.oasico_id = public.my_oasico_id())));

-- MENTORING (privadas só ADM)
create policy ment_select on public.mentoring_sessions for select using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy ment_write on public.mentoring_sessions for all using (public.is_adm()) with check (public.is_adm());
create policy ment_priv_all on public.mentoring_private for all using (public.is_adm()) with check (public.is_adm());

-- TASKS (Oásico cria/edita as próprias; ADM tudo)
create policy tasks_select on public.tasks for select using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy tasks_insert on public.tasks for insert with check (public.is_adm() or oasico_id = public.my_oasico_id());
create policy tasks_update on public.tasks for update using (public.is_adm() or oasico_id = public.my_oasico_id());
create policy tasks_delete on public.tasks for delete using (public.is_adm());

-- GROUP EVENTS (todos veem; ADM gerencia)
create policy ge_select on public.group_events for select using (auth.uid() is not null);
create policy ge_write on public.group_events for all using (public.is_adm()) with check (public.is_adm());

-- NOTIFICATIONS
create policy notif_select on public.notifications for select using (recipient = auth.uid() or public.is_adm());
create policy notif_insert on public.notifications for insert with check (public.is_adm() or recipient = auth.uid());
create policy notif_update on public.notifications for update using (recipient = auth.uid());
create policy notif_delete on public.notifications for delete using (recipient = auth.uid() or public.is_adm());

-- PUSH SUBSCRIPTIONS (cada um as próprias)
create policy push_all on public.push_subscriptions for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
