-- =====================================================
-- MIGRATION: Create Case Submissions System
-- Date: 2025-11-23
-- Description: User-submitted case studies with approval workflow
-- =====================================================

-- 1. CREATE TABLE: case_submissions
CREATE TABLE IF NOT EXISTS case_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Case Study Information
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  attack_type VARCHAR(100),  -- e.g., 'Phishing', 'Ransomware', 'DDoS'
  impact_level VARCHAR(20) CHECK (impact_level IN ('Low', 'Medium', 'High')),
  date DATE,
  source_url TEXT,  -- Optional: link to news/source
  mitigation TEXT,
  
  -- Submission Metadata
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- Nullable for guest submissions
  submitter_email VARCHAR(255),  -- Email for notifications (for guests or override)
  submitted_at TIMESTAMP DEFAULT NOW(),
  
  -- Admin Review
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  admin_feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- 2. CREATE INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON case_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON case_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_submissions_date ON case_submissions(date DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON case_submissions(created_at DESC);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE case_submissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON case_submissions FOR SELECT
  USING (auth.uid() = submitted_by);

-- Policy: Users can insert submissions
CREATE POLICY "Users can insert submissions"
  ON case_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = submitted_by OR submitted_by IS NULL
  );

-- Policy: Users can update ONLY their pending/rejected submissions
CREATE POLICY "Users can update own pending/rejected submissions"
  ON case_submissions FOR UPDATE
  USING (
    auth.uid() = submitted_by 
    AND status IN ('pending', 'rejected')
  );

-- Policy: Admins can view ALL submissions
CREATE POLICY "Admins can view all submissions"
  ON case_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Policy: Admins can update ALL submissions
CREATE POLICY "Admins can update all submissions"
  ON case_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Policy: Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
  ON case_submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- 5. CREATE NOTIFICATIONS TABLE (Optional)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'submission_approved', 'submission_rejected', 'submission_feedback'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(255),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_case_submissions_updated_at
  BEFORE UPDATE ON case_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE SEED DATA
-- =====================================================

-- Note: Replace 'YOUR_SAMPLE_USER_UUID' with actual user UUID from your database
-- You can get user UUID from: SELECT id FROM auth.users LIMIT 1;

INSERT INTO case_submissions (
  title, 
  description, 
  attack_type, 
  impact_level, 
  date, 
  source_url, 
  mitigation,
  status,
  submitted_by,
  submitted_at
) VALUES 
(
  'Serangan Phishing Massal Targetkan E-Commerce Indonesia',
  'Pada bulan Oktober 2024, ribuan pengguna e-commerce menerima email palsu yang mengatasnamakan platform marketplace terkenal. Email tersebut meminta pengguna untuk memverifikasi akun dengan mengklik link dan memasukkan kredensial login. Akibatnya, ratusan akun diretas dan digunakan untuk transaksi ilegal.',
  'Phishing',
  'High',
  '2024-10-15',
  'https://example.com/news/phishing-attack-2024',
  'Implementasi email authentication (SPF, DKIM, DMARC), security awareness training untuk pengguna, dan MFA wajib untuk semua akun.',
  'pending',
  NULL,  -- Guest submission
  NOW() - INTERVAL '2 days'
),
(
  'Ransomware Attack on Hospital System',
  'A hospital network was hit by ransomware, encrypting patient records and disrupting critical services. Attackers demanded $500,000 in Bitcoin. The hospital refused to pay and restored from backups, but experienced 3 days of downtime.',
  'Ransomware',
  'High',
  '2024-09-20',
  'https://example.com/news/hospital-ransomware',
  'Regular offline backups, network segmentation, endpoint detection and response (EDR), and incident response plan.',
  'approved',
  NULL,
  NOW() - INTERVAL '30 days'
);

-- Update approved submission timestamp
UPDATE case_submissions 
SET approved_at = NOW() - INTERVAL '25 days', reviewed_at = NOW() - INTERVAL '25 days'
WHERE status = 'approved';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check if tables created successfully
SELECT 
  'case_submissions' as table_name, 
  COUNT(*) as row_count 
FROM case_submissions
UNION ALL
SELECT 
  'notifications' as table_name, 
  COUNT(*) as row_count 
FROM notifications;

-- Check indexes
SELECT 
  tablename, 
  indexname 
FROM pg_indexes 
WHERE tablename IN ('case_submissions', 'notifications')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd 
FROM pg_policies 
WHERE tablename IN ('case_submissions', 'notifications')
ORDER BY tablename, policyname;
