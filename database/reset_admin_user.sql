-- =====================================================
-- RESET ADMIN USER (DELETE & RECREATE)
-- =====================================================

-- 1. Pastikan ekstensi pgcrypto aktif untuk hashing password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Hapus Admin Lama (Ganti email jika perlu)
-- Hapus dari public.users dulu
DELETE FROM public.users WHERE role = 'admin';
-- Hapus dari auth.users (ini akan menghapus sesi login juga)
DELETE FROM auth.users WHERE email = 'admin@gmail.com'; 

-- 3. Buat Admin Baru di auth.users
-- Password default di sini adalah: admin123
-- Ganti 'admin_baru@gmail.com' dengan email yang diinginkan
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin_baru@gmail.com', -- EMAIL BARU
    crypt('admin123', gen_salt('bf')), -- PASSWORD BARU (admin123)
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- 4. Masukkan ke public.users dan hubungkan (Link)
INSERT INTO public.users (name, email, role, auth_id)
SELECT 
    'Super Admin',
    email,
    'admin',
    id
FROM auth.users
WHERE email = 'admin_baru@gmail.com';

-- 5. Cek hasilnya
SELECT * FROM public.users WHERE role = 'admin';
