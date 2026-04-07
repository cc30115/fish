import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, EcosystemData } from '../services/api';

export default function EcosystemPage() {
  const [ecosystemData, setEcosystemData] = useState<EcosystemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.fetchEcosystemData();
        setEcosystemData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load ecosystem data:", error);
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

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 px-6 md:px-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tighter uppercase mb-4 md:mb-8">Ecosystem Dynamics</h1>
        <p className="text-cyan-100/80 text-base md:text-lg max-w-2xl">
          Understand how different species interact within their environments. The delicate balance of the ocean depends on every organism, from microscopic plankton to the massive leviathans.
        </p>
        
        <div className="mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {ecosystemData.map((item, index) => (
            <div key={index} className="border border-cyan-500/30 rounded-2xl p-6 md:p-8 bg-cyan-950/20">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-cyan-400">{item.title}</h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
