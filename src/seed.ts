import { createClient } from '@supabase/supabase-js';
import { SPECIES } from './aquarium/species';
import { extendedSpecies } from './aquarium/extendedSpecies';
import dotenv from 'dotenv';
dotenv.config(); // Assuming .env is in root

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in process.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching current species to check if table works...");
  const { data: existing, error: fetchError } = await supabase.from('species').select('id').limit(1);
  if (fetchError) {
    console.error("Failed to query 'species' table. Did you run the SQL? Error:", fetchError);
    return;
  }
  
  if (existing && existing.length > 0) {
    console.log("Database already has data. We won't seed.");
    return;
  }

  const ALL_LOCAL_SPECIES = [...SPECIES, ...extendedSpecies];
  console.log(`Seeding ${ALL_LOCAL_SPECIES.length} species...`);
  
  const payload = ALL_LOCAL_SPECIES.map(fish => ({
    name: fish.name,
    scientificname: fish.scientificName,
    variant: fish.variant,
    depth: fish.depth,
    size: fish.size,
    type: fish.type,
    lum: fish.lum,
    agg: fish.agg,
    "desc": fish.desc,
    habitat: fish.habitat,
    ecology: fish.ecology,
    traits: fish.traits,
    location: fish.location,
    basespeed: fish.baseSpeed,
    color: fish.color,
    imageurl: fish.imageUrl
  }));

  const { error } = await supabase.from('species').insert(payload);
  
  if (error) {
    console.error('Error during insert:', error);
  } else {
    console.log('Seed successful!');
  }
}

run();
