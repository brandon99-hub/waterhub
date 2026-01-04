-- Add location field to sites table
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update existing sites with a placeholder (optional)
-- UPDATE sites SET location = 'Location not set' WHERE location IS NULL;
