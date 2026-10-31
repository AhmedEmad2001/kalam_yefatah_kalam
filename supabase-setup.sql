-- Run this whole script in Supabase Dashboard -> SQL Editor.
create table if not exists public.shared_rooms (
  room_id text primary key check (char_length(room_id) between 20 and 80),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.shared_rooms enable row level security;
grant select, insert, update on public.shared_rooms to anon, authenticated;

drop policy if exists "Room members can read their room" on public.shared_rooms;
create policy "Room members can read their room"
on public.shared_rooms for select to anon, authenticated
using (room_id = (current_setting('request.headers', true)::jsonb ->> 'x-room-id'));

drop policy if exists "Room members can create their room" on public.shared_rooms;
create policy "Room members can create their room"
on public.shared_rooms for insert to anon, authenticated
with check (room_id = (current_setting('request.headers', true)::jsonb ->> 'x-room-id'));

drop policy if exists "Room members can update their room" on public.shared_rooms;
create policy "Room members can update their room"
on public.shared_rooms for update to anon, authenticated
using (room_id = (current_setting('request.headers', true)::jsonb ->> 'x-room-id'))
with check (room_id = (current_setting('request.headers', true)::jsonb ->> 'x-room-id'));
