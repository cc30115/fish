import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { SPECIES, DEPTH_ZONES } from '../aquarium/species';
import { extendedSpecies } from '../aquarium/extendedSpecies';
import { Save, Database, ChevronRight, Image as ImageIcon, Upload } from 'lucide-react';

// Exact duplication of the Engine drawing logic for accurate UI previews
function FishShapePreview({ type, color, size = 40, isActive, onClick, customSvg }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    
    // Scale everything down to fit inside the preview box beautifully
    const s = size * 0.15; 
    
    if (type === 'tetra') {
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(-s * 1.5, -s * 0.6);
      ctx.lineTo(-s * 1.5, s * 0.6);
      ctx.fill();
    } else if (type === 'ray') {
      ctx.beginPath();
      ctx.moveTo(s, 0);
      ctx.lineTo(-s * 0.5, -s * 0.8);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.5, s * 0.8);
      ctx.fill();
    } else if (type === 'angler') {
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(-s * 1.8, -s * 0.6);
      ctx.lineTo(-s * 1.8, s * 0.6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.quadraticCurveTo(s * 1.5, -s * 1.5, s * 1.5, 0);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 1.5, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    } else if (type === 'jelly') {
      ctx.beginPath();
      ctx.arc(0, 0, s, Math.PI, 0);
      ctx.quadraticCurveTo(0, s * 0.5, -s, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, 0); ctx.lineTo(-s * 0.5, s * 1.5);
      ctx.moveTo(0, 0); ctx.lineTo(0, s * 1.8);
      ctx.moveTo(s * 0.5, 0); ctx.lineTo(s * 0.5, s * 1.5);
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (type === 'angular') {
      ctx.beginPath();
      ctx.moveTo(s, 0);
      ctx.lineTo(-s * 0.5, -s * 0.5);
      ctx.lineTo(-s * 0.2, 0);
      ctx.lineTo(-s * 0.5, s * 0.5);
      ctx.closePath();
      ctx.fill();
    } else if (type === 'swarm') {
      for (let i = 0; i < 3; i++) {
        const ox = Math.cos(i * Math.PI * 0.6) * s * 0.8;
        const oy = Math.sin(i * Math.PI * 0.6) * s * 0.8;
        ctx.beginPath();
        ctx.ellipse(ox, oy, s * 0.4, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'flat') {
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(-s * 1.2, -s * 0.8);
      ctx.lineTo(-s * 1.2, s * 0.8);
      ctx.fill();
    } else if (type === 'squid') {
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-s * 0.8, i * s * 0.2);
        ctx.quadraticCurveTo(-s * 1.5, i * s * 0.5, -s * 2, i * s * 0.3);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (type === 'custom') {
      if (customSvg) {
        // Parse and render custom SVG path on canvas
        const img = new Image();
        const blob = new Blob([customSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          ctx.clearRect(0, 0, size, size);
          ctx.save();
          ctx.translate(size / 2, size / 2);
          // Draw SVG centered, scaled to fit
          const svgSize = size * 0.8;
          ctx.drawImage(img, -svgSize / 2, -svgSize / 2, svgSize, svgSize);
          ctx.restore();
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else {
        // Placeholder star-like icon for 'custom' when no SVG is uploaded yet
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? s : s * 0.5;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    
    ctx.restore();
  }, [type, color, size, customSvg]);

  return (
    <button 
      type="button"
      onClick={onClick}
      className={`border rounded flex flex-col items-center justify-center p-2 transition ${isActive ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
    >
      <canvas ref={canvasRef} width={size} height={size} />
      <span className="text-[10px] tracking-widest uppercase mt-1 opacity-70 text-white">{type}</span>
    </button>
  );
}

export default function AdminPage() {
  const [speciesList, setSpeciesList] = useState<any[]>([]);
  const [selectedFish, setSelectedFish] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const svgUploadRef = useRef<HTMLInputElement>(null);

  const FISH_SHAPES = ['tetra', 'ray', 'angler', 'jelly', 'swarm', 'flat', 'squid', 'custom'];

  useEffect(() => {
    fetchSpecies();
  }, []);

  async function fetchSpecies() {
    setIsLoading(true);
    const { data, error } = await supabase.from('species').select('*').order('name');
    if (error) {
      console.error('Error fetching species:', error);
      showNotification('Error fetching from database. Have you created the table?', 'error');
    } else {
      const mapped = (data || []).map(fish => ({
        ...fish,
        scientificName: fish.scientificname ?? fish.scientificName,
        baseSpeed: fish.basespeed ?? fish.baseSpeed,
        imageUrl: fish.imageurl ?? fish.imageUrl
      }));
      setSpeciesList(mapped);
    }
    setIsLoading(false);
  }

  async function seedDatabase() {
    setIsSaving(true);
    const ALL_LOCAL_SPECIES = [...SPECIES];
    // Notice desc might need special handling if not exact match, but supabase-js handles object keys mapped to column names well
    
    // We map so that the payload perfectly matches our schema (lowercase)
    const payload = ALL_LOCAL_SPECIES.map(fish => ({
      name: fish.name,
      scientificname: fish.scientificName,
      variant: fish.variant,
      depth: fish.depth, // jsonb array
      size: fish.size,
      type: fish.type,
      lum: fish.lum,
      agg: fish.agg,
      "desc": fish.desc,
      habitat: fish.habitat,
      ecology: fish.ecology,
      traits: fish.traits, // jsonb
      location: fish.location,
      basespeed: fish.baseSpeed,
      color: fish.color,
      imageurl: fish.imageUrl
    }));

    const { error } = await supabase.from('species').insert(payload);
    
    if (error) {
      console.error('Error seeding DB:', error);
      showNotification(`Failed to seed: ${error.message}`, 'error');
    } else {
      showNotification('Database successfully seeded!', 'success');
      await fetchSpecies();
    }
    setIsSaving(false);
  }

  // Get the stored SVG from the traits array
  function getCustomSvg(fish: any): string | undefined {
    if (!fish?.traits) return undefined;
    const trait = fish.traits.find((t: any) => t.name === '__customSvg');
    return trait?.value;
  }

  // Handle SVG file upload – stores SVG string in fish.traits
  function handleSvgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith('.svg')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const svgText = ev.target?.result as string;
      if (!svgText) return;
      // Store SVG inside the traits array under __customSvg key
      setSelectedFish((prev: any) => {
        const existingTraits = (prev.traits || []).filter((t: any) => t.name !== '__customSvg');
        return {
          ...prev,
          type: 'custom',
          traits: [...existingTraits, { name: '__customSvg', value: svgText }]
        };
      });
      showNotification('SVG icon loaded! Select "custom" shape and Save.', 'success');
    };
    reader.readAsText(file);
    // Reset the input so re-uploading same file triggers onChange
    e.target.value = '';
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFish) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('species')
      .update({
        name: selectedFish.name,
        scientificname: selectedFish.scientificName,
        variant: selectedFish.variant,
        "desc": selectedFish.desc,
        ecology: selectedFish.ecology,
        habitat: selectedFish.habitat,
        type: selectedFish.type,
        depth: selectedFish.depth,
        imageurl: selectedFish.imageUrl,
        size: Number(selectedFish.size),
        lum: Number(selectedFish.lum),
        agg: Number(selectedFish.agg),
        basespeed: Number(selectedFish.baseSpeed),
        color: selectedFish.color,
        traits: selectedFish.traits  // saves custom SVG embedded in traits
      })
      .eq('id', selectedFish.id);

    if (error) {
      console.error('Update error:', error);
      showNotification('Failed to save changes.', 'error');
    } else {
      showNotification('Successfully saved! Site is universally updated.', 'success');
      setSpeciesList(prev => prev.map(f => f.id === selectedFish.id ? selectedFish : f));
    }
    setIsSaving(false);
  }

  function handleInputChange(field: string, value: any) {
    setSelectedFish((prev: any) => ({ ...prev, [field]: value }));
  }

  function handleDepthChange(index: number, value: string) {
    const num = parseFloat(value);
    const newDepth = [...(selectedFish.depth || [0, 0])];
    newDepth[index] = isNaN(num) ? 0 : Math.min(1, Math.max(0, num));
    // Sort array so min is always first
    if (index === 1 && newDepth[1] < newDepth[0]) newDepth[0] = newDepth[1];
    if (index === 0 && newDepth[0] > newDepth[1]) newDepth[1] = newDepth[0];
    
    handleInputChange('depth', newDepth);
  }

  function showNotification(msg: string, type: 'success' | 'error') {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  // Generate CSS Gradient for Depth Visualizer based precisely on species.ts DEPTH_ZONES
  const gradientStops = DEPTH_ZONES.map(z => `${z.color} ${z.range[0] * 100}%`).join(', ');

  return (
    <div className="w-full h-full bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`absolute top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center shadow-lg ${notification.type === 'success' ? 'bg-cyan-500 text-black' : 'bg-red-500 text-white'}`}>
          <span className="font-bold tracking-widest uppercase text-sm">{notification.msg}</span>
        </div>
      )}

      {/* Sidebar - Species List */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-1/3 md:h-full bg-slate-900 border-b md:border-b-0 md:border-r border-white/10 flex flex-col pt-24 md:pt-32">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur pb-4">
          <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400">Database</h2>
          {speciesList.length === 0 && !isLoading && (
            <button 
              onClick={seedDatabase} 
              disabled={isSaving}
              className="px-3 py-1.5 bg-cyan-500 text-black rounded text-xs font-bold hover:bg-cyan-400 flex items-center gap-2 transition"
            >
              <Database size={14} /> Seed
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
          {isLoading ? (
            <div className="text-slate-400 text-center text-sm py-8 tracking-widest uppercase animate-pulse">Loading...</div>
          ) : speciesList.length === 0 ? (
            <div className="text-slate-500 text-center text-sm py-8 px-4 leading-relaxed">
              No species found. <br/>Click the Seed button above to import the local data.
            </div>
          ) : (
            speciesList.map(fish => (
              <button
                key={fish.id}
                onClick={() => setSelectedFish(fish)}
                className={`w-full text-left px-4 py-3 rounded transition flex items-center justify-between ${selectedFish?.id === fish.id ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent text-slate-300'}`}
              >
                <div>
                  <div className="font-bold text-sm tracking-wide">{fish.name}</div>
                  <div className="text-xs opacity-50">{fish.type} • {fish.variant}</div>
                </div>
                <ChevronRight size={16} className={selectedFish?.id === fish.id ? 'text-cyan-400' : 'text-slate-600'} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Editor Form */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-2/3 md:h-full bg-slate-950 overflow-y-auto px-6 py-8 md:p-12 md:pt-32">
        {selectedFish ? (
          <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">{selectedFish.name}</h1>
                <p className="text-cyan-400 font-medium tracking-widest text-sm mt-2">ID: {selectedFish.id}</p>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-3 bg-cyan-500 text-black font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-2">Core Identity</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={selectedFish.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Variant Label</label>
                    <input 
                      type="text" 
                      value={selectedFish.variant || ''} 
                      onChange={(e) => handleInputChange('variant', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  {/* VISUAL FISH ICON SELECTOR */}
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Shape Icon (Updates Live Render)</label>
                    <div className="grid grid-cols-4 gap-2">
                       {FISH_SHAPES.map(shape => (
                         <FishShapePreview 
                           key={shape}
                           type={shape}
                           color={selectedFish.color || '#00D4FF'}
                           isActive={selectedFish.type === shape}
                           customSvg={shape === 'custom' ? getCustomSvg(selectedFish) : undefined}
                           onClick={() => handleInputChange('type', shape)}
                         />
                       ))}
                    </div>
                  </div>

                  {/* SVG UPLOAD BUTTON */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <Upload size={12} /> Upload Custom SVG Icon
                    </label>
                    <input
                      ref={svgUploadRef}
                      type="file"
                      accept=".svg"
                      className="hidden"
                      onChange={handleSvgUpload}
                    />
                    <button
                      type="button"
                      onClick={() => svgUploadRef.current?.click()}
                      className="w-full border border-dashed border-slate-600 hover:border-cyan-500 rounded p-3 text-slate-400 hover:text-cyan-400 text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
                    >
                      <Upload size={16} />
                      {getCustomSvg(selectedFish) ? 'Re-Upload SVG (Loaded ✓)' : 'Upload .SVG File'}
                    </button>
                    {getCustomSvg(selectedFish) && (
                      <p className="text-xs text-cyan-400/60 mt-2 tracking-wide">Custom SVG loaded. The "custom" shape tile will use it in the tank.</p>
                    )}
                  </div>
                  
                  {/* VISUAL DEPTH SLIDER WITH COLOR */}
                  <div className="pt-4 space-y-4 relative">
                      <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Target Depth [Min, Max] Zone Map</label>
                      
                      {/* Complex Visual Slider */}
                      <div className="relative pt-6 pb-8">
                        {/* the color background mapper */}
                        <div 
                          className="absolute top-2 w-full h-8 rounded border border-white/20 select-none overflow-hidden" 
                          style={{ background: `linear-gradient(to right, ${gradientStops})` }}
                        >
                           {/* Render faint dividing lines and zone names */}
                           {DEPTH_ZONES.map((zone, i) => (
                             <div 
                               key={i} 
                               className="absolute h-full border-l border-white/20 text-[8px] pl-1 pt-1 font-bold text-white/70 overflow-hidden tracking-widest uppercase right" 
                               style={{ left: `${zone.range[0] * 100}%`, width: `${(zone.range[1]-zone.range[0]) * 100}%` }}
                             >
                               {zone.name.replace('Pelagic', '')}
                             </div>
                           ))}
                        </div>

                        {/* Custom handles (overlay) */}
                        <div className="relative z-10 h-2 mt-4">
                          <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={selectedFish.depth?.[0] ?? 0}
                            onChange={(e) => handleDepthChange(0, e.target.value)}
                            className="absolute pointer-events-auto w-full appearance-none bg-transparent"
                            style={{ zIndex: 3 }}
                          />
                          <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={selectedFish.depth?.[1] ?? 0.2}
                            onChange={(e) => handleDepthChange(1, e.target.value)}
                            className="absolute pointer-events-auto w-full appearance-none bg-transparent"
                            style={{ zIndex: 4 }}
                          />
                        </div>

                        <div className="flex justify-between mt-4">
                          <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">Top: {(selectedFish.depth?.[0] ?? 0).toFixed(2)}</span>
                          <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">Bottom: {(selectedFish.depth?.[1] ?? 0.2).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Note for the User */}
                      <p className="text-xs text-slate-500 italic">Drag to map the exact spawning zone from Surface to Hadal.</p>
                  </div>
                </div>
              </div>

              {/* Content & Media */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-2">Content & Media</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Description</label>
                    <textarea 
                      value={selectedFish.desc || ''} 
                      onChange={(e) => handleInputChange('desc', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white h-24 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Ecology & Behavior</label>
                    <textarea 
                      value={selectedFish.ecology || ''} 
                      onChange={(e) => handleInputChange('ecology', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white h-24 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
                    />
                  </div>

                  {/* Image Preview & URL */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold tracking-widest text-slate-500 uppercase mb-2 flex items-center gap-2"><ImageIcon size={14}/> Image Source URL</label>
                    <input 
                      type="text" 
                      value={selectedFish.imageUrl || ''} 
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white mb-4 focus:outline-none focus:border-cyan-500 transition"
                      placeholder="https://..."
                    />
                    {selectedFish.imageUrl ? (
                      <div className="relative w-full h-48 rounded bg-slate-900 border border-slate-800 overflow-hidden group">
                        <img 
                          src={selectedFish.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none">
                          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 backdrop-blur px-2 py-1 bg-black/40 rounded border border-cyan-400/20 shadow">Live Preview Installed</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded bg-slate-900 border border-slate-800 border-dashed flex items-center justify-center text-slate-600">
                        <div className="text-center">
                          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                          <span className="text-xs font-bold tracking-widest uppercase">No Image Set</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </form>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 pt-10">
            <div className="w-24 h-24 rounded-full border border-slate-800 flex items-center justify-center mb-4 bg-slate-900">
              <Database size={32} className="opacity-50 text-cyan-500" />
            </div>
            <p className="text-sm tracking-widest uppercase">Select a species from the database to edit</p>
          </div>
        )}
      </div>

    </div>
  );
}
