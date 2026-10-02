-- Permite lectura pública y limita las escrituras a usuarios autenticados.
begin;

alter table public."Pelicula" enable row level security;

revoke all on table public."Pelicula" from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public."Pelicula" to anon, authenticated;
grant insert, update, delete on table public."Pelicula" to authenticated;

drop policy if exists "Public can read Pelicula" on public."Pelicula";
drop policy if exists "Authenticated can insert Pelicula" on public."Pelicula";
drop policy if exists "Authenticated can update Pelicula" on public."Pelicula";
drop policy if exists "Authenticated can delete Pelicula" on public."Pelicula";

create policy "Public can read Pelicula"
on public."Pelicula"
for select
to anon, authenticated
using (true);

create policy "Authenticated can insert Pelicula"
on public."Pelicula"
for insert
to authenticated
with check ((select auth.uid()) is not null);

create policy "Authenticated can update Pelicula"
on public."Pelicula"
for update
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated can delete Pelicula"
on public."Pelicula"
for delete
to authenticated
using ((select auth.uid()) is not null);

commit;
