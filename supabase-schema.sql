-- Event Manager PWA - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Partido', 'Concierto', 'Fira')),
  start_date DATE NOT NULL,
  end_date DATE,
  hours_worked NUMERIC DEFAULT 0,
  payment_expected NUMERIC DEFAULT 0,
  payment_real NUMERIC DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create an index on start_date for faster queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- Create an index on is_paid for faster filtering
CREATE INDEX IF NOT EXISTS idx_events_is_paid ON events(is_paid);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- Note: In production, you should add proper authentication and user-specific policies
CREATE POLICY "Enable all access for now" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Event Manager PWA database schema created successfully!';
  RAISE NOTICE 'You can now use this database with your app.';
END $$;
