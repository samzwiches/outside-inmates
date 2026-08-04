-- Harden internal trigger helpers so they cannot be called through the public API.

revoke execute on function public.forum_display_name(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_profile() from public, anon, authenticated;
revoke execute on function public.refresh_forum_thread_activity() from public, anon, authenticated;
revoke execute on function public.set_forum_author_name() from public, anon, authenticated;

-- This function is used only by a database trigger. Pin its search path and
-- remove direct API execution privileges.
alter function public.set_resources_updated_at() set search_path = public;
revoke execute on function public.set_resources_updated_at() from public, anon, authenticated;
