import { SpeciesData, DEPTH_ZONES, SPECIES } from '../aquarium/species';
import { extendedSpecies } from '../aquarium/extendedSpecies';
import { supabase } from './supabase';

const ALL_SPECIES = [...SPECIES, ...extendedSpecies];
export interface EcosystemData {
  title: string;
  description: string;
}

// Mock API calls to prepare for real backend integration
export const api = {
  async fetchSpecies(): Promise<SpeciesData[]> {
    const { data, error } = await supabase.from('species').select('*');
    if (error) {
      console.error('Error fetching from Supabase, falling back to local data', error);
      return ALL_SPECIES;
    }
    // Return data, mapped back to camelCase for the UI
    const mapped = (data || []).map(fish => ({
      ...fish,
      scientificName: fish.scientificname ?? fish.scientificName,
      baseSpeed: fish.basespeed ?? fish.baseSpeed,
      imageUrl: fish.imageurl ?? fish.imageUrl
    }));
    return mapped.length > 0 ? (mapped as SpeciesData[]) : ALL_SPECIES;
  },

  async fetchDepthZones() {
    return new Promise<typeof DEPTH_ZONES>((resolve) => {
      setTimeout(() => resolve(DEPTH_ZONES), 500);
    });
  },

  async fetchEcosystemData(): Promise<EcosystemData[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          title: 'Food Web',
          description: 'Energy flows from the sunlit surface down to the darkest depths. Marine snow provides vital nutrients for deep-sea dwellers, while predators maintain population balances across all zones.'
        },
        {
          title: 'Environmental Factors',
          description: 'Temperature, pressure, and light availability drastically shape the habitats. Species have evolved incredible adaptations to survive in the extreme conditions of the abyss.'
        }
      ]), 500);
    });
  }
};
