-- Add user_id column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable RLS (Row Level Security) if not already enabled
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Remove existing broad policy if exists
DROP POLICY IF EXISTS "Enable all access for now" ON events;

-- Create secure policies
-- 1. Users can only see their own events
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Users can only insert their own events
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Users can only update their own events
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Users can only delete their own events
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE
  USING (auth.uid() = user_id);
