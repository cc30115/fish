import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AquariumView from './pages/AquariumView';
import SpeciesPage from './pages/SpeciesPage';
import EcosystemPage from './pages/EcosystemPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full"></div>
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tighter uppercase">Stitch Aquarium</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12 text-sm font-medium tracking-widest uppercase pointer-events-auto">
          <Link to="/species" className={`transition-colors ${location.pathname === '/species' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Species</Link>
          <Link to="/ecosystem" className={`transition-colors ${location.pathname === '/ecosystem' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Ecosystem</Link>
          <Link to="/admin" className={`transition-colors ${location.pathname === '/admin' ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>Lab</Link>
          <button className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">Connect</button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden pointer-events-auto">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-8 text-lg font-medium tracking-widest uppercase pointer-events-auto">
          <Link to="/species" onClick={() => setIsMobileMenuOpen(false)} className={`${location.pathname === '/species' ? 'text-cyan-400' : 'text-white'}`}>Species</Link>
          <Link to="/ecosystem" onClick={() => setIsMobileMenuOpen(false)} className={`${location.pathname === '/ecosystem' ? 'text-cyan-400' : 'text-white'}`}>Ecosystem</Link>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`${location.pathname === '/admin' ? 'text-cyan-400' : 'text-white'}`}>Lab</Link>
          <button className="px-8 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all" onClick={() => setIsMobileMenuOpen(false)}>Connect</button>
        </div>
      )}

      {/* Background for non-home pages to ensure readability if canvas is unmounted */}
      {!isHome && <div className="absolute inset-0 bg-black z-0"></div>}

      <div className="relative z-10 w-full h-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<AquariumView />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/ecosystem" element={<EcosystemPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
}
