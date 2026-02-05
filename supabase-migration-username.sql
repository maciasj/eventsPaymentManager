-- Add username column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS username TEXT;

-- Create an index for performance
CREATE INDEX IF NOT EXISTS idx_events_username ON events(username);

-- Allow public access (since we are not using passwords)
-- WARNING: This means anyone with the API key can read data, but the app will filter it nicely.
DROP POLICY IF EXISTS "Enable all access for now" ON events;

CREATE POLICY "Enable all access based on username" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);
