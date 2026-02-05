-- Add time columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TEXT;

-- Update the comments or documentation if necessary
COMMENT ON COLUMN events.start_time IS 'Start time of the event (HH:MM)';
COMMENT ON COLUMN events.end_time IS 'End time of the event (HH:MM)';
