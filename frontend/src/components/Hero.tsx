import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="hero" className="relative h-full flex flex-col justify-center px-6 sm:px-12 md:px-24 overflow-hidden">
      {/* Noise Texture layer */}
      <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />
      
      {/* Ambient background glows - Dynamic positioning for mobile/desktop */}
      <div className="absolute top-[-5%] right-[-5%] w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-brand-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full z-10"
      >
        <div className="flex items-center gap-3 mb-8 md:mb-10">
          <div className="h-px w-8 md:w-12 bg-brand-accent" />
          <span className="text-[10px] md:text-xs font-mono font-medium uppercase tracking-[0.4em] text-brand-accent">
            Secure Digital Notary
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 md:mb-8 leading-[0.85] md:leading-[0.9]">
          PROOF OF <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-600">
            EXISTENCE.
          </span>
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 font-light leading-snug tracking-tight max-w-2xl">
            Cryptographic document preservation. 
            Generate an unalterable timestamp for any file, 
            proving it existed at a specific point in time without ever uploading the content.
          </p>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto justify-start md:justify-end gap-4">
            <button 
              onClick={() => document.getElementById('action-hub')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary w-full sm:w-auto min-w-[180px] h-14 text-[10px] md:text-xs uppercase tracking-widest"
            >
              Seal New File
            </button>
            <button 
              onClick={() => document.getElementById('blockchain')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary w-full sm:w-auto min-w-[180px] h-14 text-[10px] md:text-xs uppercase tracking-widest"
            >
              Audit Trail
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile-only scroll hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-gray-600">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-brand-accent to-transparent" />
      </motion.div>
    </section>
  );
}
