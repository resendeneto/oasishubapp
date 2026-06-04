-- ===== OASIS HUB :: TRIGGERS + REALTIME =====

-- Cria profile (e oasico, se aplicável) ao cadastrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare r text;
begin
  r := coalesce(new.raw_user_meta_data->>'role','oasico');
  insert into public.profiles(id, email, full_name, role)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email), r)
    on conflict (id) do nothing;
  if r = 'oasico' then
    insert into public.oasicos(profile_id, name, company, email)
      values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email),
              new.raw_user_meta_data->>'company', new.email)
      on conflict (profile_id) do nothing;
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impede que um não-ADM altere o próprio papel
create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role <> old.role and not public.is_adm() then
    new.role := old.role;
  end if;
  return new;
end; $$;

drop trigger if exists trg_guard_role on public.profiles;
create trigger trg_guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

-- Realtime
do $$ begin
  begin alter publication supabase_realtime add table public.notifications; exception when others then null; end;
  begin alter publication supabase_realtime add table public.tasks; exception when others then null; end;
  begin alter publication supabase_realtime add table public.oasicos; exception when others then null; end;
  begin alter publication supabase_realtime add table public.group_events; exception when others then null; end;
  begin alter publication supabase_realtime add table public.mentoring_sessions; exception when others then null; end;
end $$;

-- Promova seu usuário a ADM depois do 1º cadastro (troque o e-mail):
-- update public.profiles set role = 'adm' where email = 'seu-email@exemplo.com';
-- delete from public.oasicos where profile_id = (select id from public.profiles where email = 'seu-email@exemplo.com');
