create type content_source as enum ('local', 'database');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'public')),
  created_at timestamptz not null default now()
);

create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text not null,
  updated_at timestamptz default now(),
  source content_source not null default 'local'
);

create table if not exists bibliography (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  title text not null,
  year varchar(10),
  publisher text,
  url text
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date,
  impact_level text,
  mitigation text,
  image_url text
);

create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nim text,
  role text,
  image_url text
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_subtitle text,
  stats_json jsonb default '[]'::jsonb
);

