-- Execute no SQL Editor do Supabase

alter table interactions add column if not exists number bigserial unique;
alter table interactions add column if not exists attachment_url text;
