/// <reference path="../.astro/types.d.ts" />

// Tipos de sesión y Supabase disponibles en las rutas Astro y su middleware.
declare namespace App {
  interface Locals {
    supabase: import('@supabase/supabase-js').SupabaseClient;
    user: import('@supabase/supabase-js').User | null;
  }
}
