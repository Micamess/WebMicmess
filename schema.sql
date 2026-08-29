-- Sitio de Micamess — esquema de base de datos
-- Pegá todo este archivo en Supabase → SQL Editor → "New query" → Run.

-- 1) Biblioteca de juegos -----------------------------------------------------
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  status text not null default 'jugando'
    check (status in ('jugando', 'pausado', 'completado', 'abandonado')),
  hours_played numeric not null default 0,
  note text,
  created_at timestamptz not null default now()
);

-- 2) Juegos recomendados por la comunidad -------------------------------------
create table if not exists public.recommended_games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  steam_url text,
  recommended_by text,
  note text,
  created_at timestamptz not null default now()
);

-- 3) Seguridad: CUALQUIERA puede leer, SOLO una cuenta logueada puede escribir --
-- (Este sitio es público. Al no permitir registro abierto de usuarios, la
-- única cuenta que va a existir es la de Micamess, así que "hay sesión" ya
-- equivale a "es ella".)
alter table public.games enable row level security;
alter table public.recommended_games enable row level security;

drop policy if exists "games_public_read" on public.games;
create policy "games_public_read" on public.games for select using (true);

drop policy if exists "games_admin_write" on public.games;
create policy "games_admin_write" on public.games for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "recommended_public_read" on public.recommended_games;
create policy "recommended_public_read" on public.recommended_games for select using (true);

drop policy if exists "recommended_admin_write" on public.recommended_games;
create policy "recommended_admin_write" on public.recommended_games for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- 4) Redes sociales (editables desde el panel de admin) -----------------------
create table if not exists public.social_links (
  platform text primary key,
  url text not null default ''
);

insert into public.social_links (platform, url) values
  ('discord', ''), ('instagram', ''), ('kick', ''), ('youtube', ''), ('tiktok', '')
on conflict (platform) do nothing;

alter table public.social_links enable row level security;

drop policy if exists "social_links_public_read" on public.social_links;
create policy "social_links_public_read" on public.social_links for select using (true);

drop policy if exists "social_links_admin_write" on public.social_links;
create policy "social_links_admin_write" on public.social_links for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- 5) Sorteos --------------------------------------------------------------------
create table if not exists public.giveaways (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  keyword text not null default '!participo',
  status text not null default 'abierto' check (status in ('abierto', 'cerrado')),
  winner_username text,
  created_at timestamptz not null default now()
);

create table if not exists public.giveaway_entries (
  id uuid primary key default gen_random_uuid(),
  giveaway_id uuid not null references public.giveaways (id) on delete cascade,
  kick_username text not null,
  created_at timestamptz not null default now(),
  unique (giveaway_id, kick_username)
);

alter table public.giveaways enable row level security;
alter table public.giveaway_entries enable row level security;

drop policy if exists "giveaways_public_read" on public.giveaways;
create policy "giveaways_public_read" on public.giveaways for select using (true);

drop policy if exists "giveaways_admin_write" on public.giveaways;
create policy "giveaways_admin_write" on public.giveaways for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "giveaway_entries_public_read" on public.giveaway_entries;
create policy "giveaway_entries_public_read" on public.giveaway_entries for select using (true);

-- Solo la admin (o, más adelante, el lector de chat con permisos de servidor)
-- puede cargar participantes. Así nadie puede sumarse a mano desde el navegador.
drop policy if exists "giveaway_entries_admin_write" on public.giveaway_entries;
create policy "giveaway_entries_admin_write" on public.giveaway_entries for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- 6) Conexión con Kick (Etapa 3) --------------------------------------------
-- Guarda los tokens del canal autorizado. Nadie los puede leer ni escribir
-- desde el navegador (ni admin ni p�blico) — solo las funciones de servidor,
-- que usan la service role key y por lo tanto se saltean RLS por completo.
create table if not exists public.kick_connection (
  id boolean primary key default true,
  broadcaster_user_id bigint,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  connected_at timestamptz default now(),
  constraint kick_connection_singleton check (id)
);
alter table public.kick_connection enable row level security;

-- Evita procesar dos veces el mismo mensaje si Kick reintenta el webhook
create table if not exists public.webhook_events_seen (
  message_id text primary key,
  received_at timestamptz not null default now()
);
alter table public.webhook_events_seen enable row level security;
