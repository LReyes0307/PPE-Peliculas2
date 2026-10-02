-- Verifica RLS, permisos por rol y presencia de las cuatro políticas.
begin;
select plan(9);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public."Pelicula"'::regclass
  ),
  'RLS is enabled on Pelicula'
);

select ok(
  has_table_privilege('anon', 'public."Pelicula"', 'select'),
  'anon can read the public catalog'
);
select ok(
  not has_table_privilege('anon', 'public."Pelicula"', 'insert'),
  'anon cannot insert movies'
);
select ok(
  not has_table_privilege('anon', 'public."Pelicula"', 'update'),
  'anon cannot update movies'
);
select ok(
  not has_table_privilege('anon', 'public."Pelicula"', 'delete'),
  'anon cannot delete movies'
);

select ok(
  has_table_privilege('authenticated', 'public."Pelicula"', 'insert'),
  'authenticated can insert movies'
);
select ok(
  has_table_privilege('authenticated', 'public."Pelicula"', 'update'),
  'authenticated can update movies'
);
select ok(
  has_table_privilege('authenticated', 'public."Pelicula"', 'delete'),
  'authenticated can delete movies'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'public'
      and tablename = 'Pelicula'
      and policyname in (
        'Public can read Pelicula',
        'Authenticated can insert Pelicula',
        'Authenticated can update Pelicula',
        'Authenticated can delete Pelicula'
      )
  ),
  4,
  'all four Pelicula policies exist'
);

select * from finish();
rollback;
