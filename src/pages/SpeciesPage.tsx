import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { SpeciesData } from '../aquarium/species';

export default function SpeciesPage() {
  const [speciesList, setSpeciesList] = useState<SpeciesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const DEPTH_ZONES = [
    { id: 'all', name: 'Global Ocean (All)', range: [0, 1] },
    { id: 'epi', name: 'Surface (0-200m)', range: [0, 0.2] },
    { id: 'meso', name: 'Twilight Zone (200-1000m)', range: [0.2, 0.4] },
    { id: 'bathy', name: 'Midnight Zone (1000-4000m)', range: [0.4, 0.7] },
    { id: 'abyss', name: 'Abyssal (4000-6000m)', range: [0.7, 0.9] },
    { id: 'hadal', name: 'Hadal Trenches (6000m+)', range: [0.9, 1.0] }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.fetchSpecies();
        setSpeciesList(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load species:", error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredSpecies = speciesList.filter(species => {
    if (selectedZone === 'all') return true;
    const zone = DEPTH_ZONES.find(z => z.id === selectedZone);
    if (!zone) return true;
    return Math.max(species.depth[0], zone.range[0]) <= Math.min(species.depth[1], zone.range[1]);
  });

  return (
    <div className="min-h-screen bg-[#02050a] text-white pt-24 md:pt-32 px-6 md:px-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Species Database</h1>
            <p className="text-cyan-100/80 text-base md:text-lg max-w-2xl">
              Explore the diverse range of marine life discovered in the Stitch Aquarium. From the sunlit surface down to the crushing depths.
            </p>
          </div>
          <div className="text-right text-xs uppercase tracking-widest text-cyan-500 font-bold">
            Currently Tracking: <span className="text-2xl text-white block mt-1">{filteredSpecies.length} Species</span>
          </div>
        </div>
        
        {/* Depth Filter UI */}
        <div className="flex flex-wrap gap-3 pb-6 border-b border-white/5">
          {DEPTH_ZONES.map(zone => (
            <button
               key={zone.id}
               onClick={() => setSelectedZone(zone.id)}
               className={`px-4 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                 selectedZone === zone.id 
                 ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-400' 
                 : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
               }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
        
        {filteredSpecies.length === 0 && (
          <div className="py-20 text-center text-white/40 italic">
            No known species discovered in this zone yet.
          </div>
        )}

        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredSpecies.map((species, i) => (
            <div key={i} className="border border-white/10 rounded-2xl bg-[#0a0f1e]/80 backdrop-blur-sm hover:bg-[#111a30]/80 transition-all duration-300 group flex flex-col overflow-hidden shadow-xl">
              <div className="w-full h-48 bg-cyan-950/40 relative flex items-center justify-center overflow-hidden shrink-0">
                {species.imageUrl ? (
                  <img 
                    src={species.imageUrl} 
                    alt={species.name} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-cyan-400/50">No Image</span>
                )}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/10 flex items-center shadow-lg">
                  <span className="text-[10px] font-mono font-bold text-cyan-300">
                    {Math.round(species.depth[0]*8000)}m - {Math.round(species.depth[1]*8000)}m
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-1">{species.name}</h3>
                  <p className="text-[11px] md:text-xs italic text-cyan-400 mb-2">{species.scientificName}</p>
                  <span className="inline-block border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[9px] px-2 py-0.5 rounded uppercase tracking-widest">{species.variant}</span>
                </div>
                
                <p className="text-sm leading-relaxed text-white/70 italic mb-6">"{species.desc}"</p>
                
                <div className="space-y-5 mb-auto">
                  <div>
                    <span className="block text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">Habitat & Location</span>
                    <p className="text-xs text-cyan-100 mb-1">{species.location}</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{species.habitat}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">Ecology</span>
                    <p className="text-xs text-white/80 leading-relaxed">{species.ecology}</p>
                  </div>
                  
                  {species.traits && species.traits.length > 0 && (
                  <div>
                    <span className="block text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Notable Traits</span>
                    <div className="grid grid-cols-2 gap-2">
                       {species.traits.map((t, idx) => (
                         <div key={idx} className="bg-white/5 border border-white/5 p-2.5 rounded-lg text-left">
                            <span className="block text-[8px] text-white/40 uppercase tracking-widest mb-1">{t.name}</span>
                            <span className="block text-[11px] font-medium text-white/90">{t.value}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  )}
                </div>
                
                <div className="mt-8 pt-5 border-t border-white/5 space-y-4">
                    <div>
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
                        <span className="text-cyan-400/70">Luminescence</span>
                        <span className="text-cyan-300">{species.lum}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-600 to-cyan-300 h-full" style={{ width: `${species.lum}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
                        <span className="text-red-400/70">Aggression</span>
                        <span className="text-red-300">{species.agg}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-red-900 to-red-500 h-full" style={{ width: `${species.agg}%` }}></div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
