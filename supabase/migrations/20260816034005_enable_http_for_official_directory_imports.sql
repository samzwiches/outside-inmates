-- Enables the PostgreSQL http extension used for official directory imports.
-- This migration already exists in the linked remote Supabase migration history.

create extension if not exists http;
