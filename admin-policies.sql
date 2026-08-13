-- تشغيل هذا الجزء بعد إنشاء حساب المشرف في Authentication > Users.
-- استبدل USER_UUID بمعرّف المستخدم (UUID) من Supabase Auth.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admin_users enable row level security;

create policy "admins can read own role"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

create policy "admins can read pending"
on public.pending_updates for select
to authenticated
using (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admins can delete pending"
on public.pending_updates for delete
to authenticated
using (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admins can update stations"
on public.stations for update
to authenticated
using (exists(select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admins can insert stations"
on public.stations for insert
to authenticated
with check (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

create policy "admins can delete stations"
on public.stations for delete
to authenticated
using (exists(select 1 from public.admin_users a where a.user_id = auth.uid()));

-- بعد إنشاء حساب المشرف، نفّذ:
-- insert into public.admin_users(user_id) values ('USER_UUID');
