-- صلاحيات إضافية للوحة المشرف
create policy "Authenticated admins can view stations"
on public.stations for select to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can insert stations"
on public.stations for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can delete stations"
on public.stations for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));
