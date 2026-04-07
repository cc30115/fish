-- Run this query in your Supabase SQL Editor to RECREATE the species table properly.
-- Go to https://supabase.com/dashboard/project/_/sql

DROP TABLE IF EXISTS species;

CREATE TABLE species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "scientificName" TEXT,
  variant TEXT,
  depth JSONB,
  size NUMERIC,
  type TEXT,
  lum NUMERIC,
  agg NUMERIC,
  "desc" TEXT,
  habitat TEXT,
  ecology TEXT,
  traits JSONB,
  location TEXT,
  "baseSpeed" NUMERIC,
  color TEXT,
  "imageUrl" TEXT
);

-- Turn off Row Level Security (RLS) for the admin tools to work without authentication right now
ALTER TABLE species DISABLE ROW LEVEL SECURITY;
