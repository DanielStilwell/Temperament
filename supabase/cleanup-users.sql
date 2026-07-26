-- Delete two test accounts and all related data (cascade)
-- Run this in Supabase SQL Editor

delete from auth.users
where email in ('1360321906@qq.com', '1415136644@qq.com');
