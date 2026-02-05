-- Create a simple table for user profiles with passwords
CREATE TABLE IF NOT EXISTS user_profiles (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL, -- Storing directly for this simple app (use specific passwords for this app only)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS logic
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to look up users and register (simple mode)
CREATE POLICY "Public profiles access" ON user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);
