-- WaterHub-Lite Schema Migration
-- Run these queries in Supabase SQL Editor in order

-- Step 1: Rename clients.address to business_address
ALTER TABLE clients 
RENAME COLUMN address TO business_address;

-- Step 2: Make business_address nullable (landlords may not have business address)
ALTER TABLE clients 
ALTER COLUMN business_address DROP NOT NULL;

-- Step 3: Remove occupancy column from meters (now managed via occupancies table)
ALTER TABLE meters 
DROP COLUMN IF EXISTS occupancy;

-- Step 4: Create occupancies table
CREATE TABLE IF NOT EXISTS occupancies (
  id SERIAL PRIMARY KEY,
  establishment_id INTEGER NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  meter_id INTEGER REFERENCES meters(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'vacant',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_occupancies_establishment ON occupancies(establishment_id);
CREATE INDEX IF NOT EXISTS idx_occupancies_meter ON occupancies(meter_id);
CREATE INDEX IF NOT EXISTS idx_occupancies_status ON occupancies(status);

-- Step 6: Add unique constraint to prevent duplicate meter assignments
CREATE UNIQUE INDEX IF NOT EXISTS idx_occupancies_meter_unique ON occupancies(meter_id) WHERE meter_id IS NOT NULL;

-- Verification queries (run these to check the migration)
-- SELECT * FROM clients LIMIT 5;
-- SELECT * FROM meters LIMIT 5;
-- SELECT * FROM occupancies LIMIT 5;
