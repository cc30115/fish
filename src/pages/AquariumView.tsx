import React, { useEffect, useRef, useState } from 'react';
import { AquariumEngine, Fish } from '../aquarium/Engine';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { SpeciesData } from '../aquarium/species';

export const COLOR_THEMES = [
  { id: 'natural', label: 'Natural',        color: null,                  swatch: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' },
  { id: 'ocean',   label: 'Ocean Blue',     color: 'rgba(0,170,255,0.85)',swatch: '#00aaff' },
  { id: 'bio',     label: 'Bioluminescent', color: 'rgba(0,255,160,0.85)',swatch: '#00ffa0' },
  { id: 'ember',   label: 'Ember',          color: 'rgba(255,110,40,0.85)',swatch: '#ff6e28' },
  { id: 'mono',    label: 'Monochrome',     color: 'rgba(200,210,230,0.75)',swatch: '#c8d2e6' },
];

export default function AquariumView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AquariumEngine | null>(null);
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [depthZones, setDepthZones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThemeId, setActiveThemeId] = useState('natural');
  const [paletteOpen, setPaletteOpen] = useState(false);

  function handleThemeChange(theme: typeof COLOR_THEMES[0]) {
    setActiveThemeId(theme.id);
    engineRef.current?.setColorTheme(theme.color);
    setPaletteOpen(false);
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [zones, species] = await Promise.all([
          api.fetchDepthZones(),
          api.fetchSpecies()
        ]);
        
        if (!isMounted) return;
        
        setDepthZones(zones);
        
        if (canvasRef.current) {
          const engine = new AquariumEngine(canvasRef.current, {
            onSelect: (fish) => {
              if (!fish) {
                setSelectedFish(null);
                return;
              }
              // Find all species that can live at this fish's depth zone
              const myMinDepth = fish.species.depth[0];
              const myMaxDepth = fish.species.depth[1];
              
              const validSpecies = species.filter(s => 
                Math.max(myMinDepth, s.depth[0]) <= Math.min(myMaxDepth, s.depth[1])
              );
              
              const randomSpecies = validSpecies.length > 0 
                ? validSpecies[Math.floor(Math.random() * validSpecies.length)]
                : species[Math.floor(Math.random() * species.length)];

              // Clone the required properties and override the species data
              setSelectedFish({ 
                x: fish.x, 
                y: fish.y, 
                species: randomSpecies 
              } as any);
            },
            onDepthChange: (depth) => {
              setCurrentDepth(depth);
            }
          }, species);

          engineRef.current = engine;
          engine.start();
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load aquarium data:", error);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, []);

  const handleScrollTo = (depth: number) => {
    if (engineRef.current) {
      engineRef.current.scrollToDepth(depth);
    }
  };

  const getActiveZoneIndex = () => {
    if (depthZones.length === 0) return 0;
    for (let i = 0; i < depthZones.length - 1; i++) {
      if (currentDepth >= depthZones[i].range[0] && currentDepth < depthZones[i+1].range[0]) {
        return i;
      }
    }
    return depthZones.length - 1;
  };

  const activeZoneIndex = getActiveZoneIndex();
  const activeZone = depthZones.length > 0 ? depthZones[activeZoneIndex] : null;

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main UI Container */}
      {!isLoading && (
        <main className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Left Sidebar */}
        <div className="absolute left-4 md:left-20 top-24 md:top-1/2 md:-translate-y-1/2 flex flex-col space-y-2 md:space-y-8 border-l border-white/10 pl-4 md:pl-6 py-2 md:py-12 pointer-events-auto max-h-[45vh] md:max-h-[70vh] overflow-y-auto scrollbar-hide">
          {depthZones.map((zone, index) => (
            <div key={zone.name} className="group cursor-pointer" onClick={() => handleScrollTo(zone.range[0])}>
              <span className="block text-[8px] md:text-[10px] uppercase tracking-widest text-cyan-400 mb-0.5 md:mb-1">{zone.label}</span>
              <h3 className={`text-xs md:text-lg transition-opacity ${activeZoneIndex === index ? 'font-bold opacity-100' : 'font-light opacity-50 group-hover:opacity-100'}`}>{zone.name}</h3>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        {activeZone && (
          <div className="absolute right-6 md:right-20 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 text-right max-w-[80vw] md:max-w-2xl pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeZone.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-8xl font-extrabold tracking-tighter leading-none mb-2 md:mb-4 uppercase">
                  {activeZone.name}
                </h1>
                <h2 className="text-lg md:text-3xl font-medium text-cyan-400 mb-3 md:mb-6">
                  "{activeZone.tagline}"
                </h2>
                <p className="text-xs md:text-lg text-cyan-100/80 font-light leading-relaxed mb-6 md:mb-8 hidden sm:block">
                  {activeZone.desc}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-end space-x-2 md:space-x-4 pointer-events-auto">
              {activeZoneIndex >= depthZones.length - 2 && (
                <button 
                  onClick={() => {
                    if (engineRef.current) {
                      engineRef.current.triggerLeviathan();
                    }
                  }}
                  className="px-4 md:px-8 py-3 md:py-4 bg-transparent border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:bg-cyan-500/20 transition-all"
                >
                  Summon Leviathan
                </button>
              )}
              <button 
                onClick={() => handleScrollTo(1)}
                className="px-4 md:px-8 py-3 md:py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-full hover:bg-cyan-400 transition-all"
              >
                Enter Abyss
              </button>
            </div>
          </div>
        )}
      </main>
      )}

      {/* ── FLOATING COLOR THEME PALETTE ── */}
      {!isLoading && (
        <div
          className="absolute bottom-6 left-1/2 z-30 pointer-events-auto"
          style={{ transform: 'translateX(-50%)' }}
        >
          {/* Theme label */}
          {paletteOpen && (
            <div
              className="absolute bottom-full mb-3 left-1/2 flex gap-2 pb-1"
              style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
            >
              {COLOR_THEMES.map(theme => (
                <button
                  key={theme.id}
                  title={theme.label}
                  onClick={() => handleThemeChange(theme)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      activeThemeId === theme.id
                        ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                        : 'border-white/20 hover:border-white/60 hover:scale-105'
                    }`}
                    style={{
                      background: theme.swatch,
                      display: 'block',
                    }}
                  />
                  <span className="text-[9px] tracking-widest uppercase text-white/50 group-hover:text-white/90 transition">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Toggle pill button */}
          <button
            onClick={() => setPaletteOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-xs font-bold tracking-widest uppercase"
            style={{
              background: 'rgba(10,15,30,0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)',
              boxShadow: paletteOpen ? '0 0 20px rgba(0,200,255,0.3)' : 'none',
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                background: COLOR_THEMES.find(t => t.id === activeThemeId)?.swatch ?? '#ffffff',
                display: 'inline-block',
                boxShadow: '0 0 6px rgba(255,255,255,0.4)',
              }}
            />
            Color Theme
          </button>
        </div>
      )}

      {/* Info Panel */}
      {!isLoading && selectedFish && engineRef.current && (
        <div 
          className="absolute z-20 p-4 md:p-6 rounded-2xl pointer-events-auto transition-all duration-100 overflow-y-auto scrollbar-hide"
          onWheel={(e) => e.stopPropagation()}
          style={{
            overscrollBehavior: 'contain',
            ...(isMobile ? {
              bottom: '20px',
              left: '20px',
              right: '20px',
              maxHeight: '60vh'
            } : {
              left: Math.min(Math.max(20, selectedFish.x + 40), window.innerWidth - 340),
              top: Math.min(Math.max(20, selectedFish.y - engineRef.current.cameraY - 100), window.innerHeight - 650),
              width: '320px',
              maxHeight: 'min(80vh, calc(100vh - 40px))'
            }),
            background: 'rgba(10, 15, 30, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">Selected Species</span>
            <button 
              className="text-white/40 hover:text-white cursor-pointer"
              onClick={() => setSelectedFish(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedFish.species.name}</h2>
          <p className="text-[10px] italic text-cyan-300 mb-1">{selectedFish.species.scientificName}</p>
          <div className="flex justify-between items-center text-[10px] md:text-xs text-white/60 mb-4 border-b border-white/10 pb-2">
            <span>{selectedFish.species.variant}</span>
            <span className="font-mono bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded">
              {Math.round(selectedFish.species.depth[0] * 8000)}m - {Math.round(selectedFish.species.depth[1] * 8000)}m
            </span>
          </div>
          
          {selectedFish.species.imageUrl && (
            <div className="w-full h-24 md:h-32 rounded-lg overflow-hidden mb-4 border border-white/10">
              <img 
                src={selectedFish.species.imageUrl} 
                alt={selectedFish.species.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Habitat</span>
                <p className="text-[11px] text-white/90">{selectedFish.species.habitat}</p>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Ecology</span>
                <p className="text-[11px] text-white/90">{selectedFish.species.ecology}</p>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Location</span>
                <p className="text-[11px] text-cyan-300/80">{selectedFish.species.location}</p>
              </div>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">Traits</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedFish.species.traits.map((trait, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded border border-white/10">
                    <span className="block text-[8px] text-cyan-400/80 uppercase tracking-wider">{trait.name}</span>
                    <span className="block text-[10px] text-white mt-0.5">{trait.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-white/40">Luminescence</span>
                <span>{selectedFish.species.lum}%</span>
              </div>
              <div className="w-full bg-white/10 h-[2px]">
                <div 
                  className="bg-cyan-400 h-full shadow-[0_0_10px_#22d3ee]" 
                  style={{ width: `${selectedFish.species.lum}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-white/40">Aggression</span>
                <span>{selectedFish.species.agg}%</span>
              </div>
              <div className="w-full bg-white/10 h-[2px]">
                <div 
                  className="bg-white h-full" 
                  style={{ width: `${selectedFish.species.agg}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <p className="mt-4 md:mt-6 text-[10px] md:text-[11px] leading-relaxed text-white/50 italic">
            "{selectedFish.species.desc}"
          </p>
        </div>
      )}
    </>
  );
}
