import { ShieldCheck, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 md:px-24">
      <div className="max-w-7xl mx-auto h-24 flex items-center justify-between border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold tracking-tighter text-white uppercase">ProofSeal</span>
        </div>

        <div className="flex items-center gap-12">
          <nav className="hidden md:flex items-center gap-12">
            {['Home', 'Verify', 'Explorer'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase() === 'verify' ? 'action-hub' : 'blockchain'}`} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
            </div>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-8 stealth-card md:hidden flex flex-col gap-6"
          >
            {['Home', 'Verify', 'Explorer'].map((item) => (
              <a key={item} href="#" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white">{item}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


