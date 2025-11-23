-- =====================================================
-- MIGRATION: Fix Users Schema & Link to Auth
-- Date: 2025-11-23
-- Description: Link custom 'users' table to Supabase 'auth.users' via UUID
-- =====================================================

-- 1. Add auth_id column to users table (if not exists)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id);

-- 2. Populate auth_id by matching emails
-- This links your existing 'Admin Fitzan' (id=1) to your Supabase Auth User
UPDATE users
SET auth_id = au.id
FROM auth.users au
WHERE users.email = au.email;

-- 3. Update is_admin function to use the new auth_id
-- Now we compare UUID with UUID (Safe & Correct)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE auth_id = auth.uid()  -- Compare UUID to UUID
    AND role = 'admin'
  );
$$;

-- 4. Update Users RLS to use auth_id
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth_id = auth.uid());

-- 5. Ensure Admin Policy uses the new function
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING (is_admin());

-- 6. Verify the link (Optional debug output)
-- This will show if the update worked
-- SELECT id, email, role, auth_id FROM users;
