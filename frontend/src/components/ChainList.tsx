import { useState, useEffect } from 'react';
import { Database, CheckCircle, Cpu, RefreshCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { proofSealService, Block, ChainStatus } from '../services/api';
import { cn } from '../lib/utils';

export function IntegrityDashboard() {
  const [status, setStatus] = useState<ChainStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkIntegrity = async () => {
    setLoading(true);
    try {
      const result = await proofSealService.validateChain();
      setStatus(result);
    } catch (err) {
      console.error(err);
      setStatus({ is_valid: false, message: 'Parity Node Offline.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIntegrity();
    const interval = setInterval(checkIntegrity, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stealth-card p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", status?.is_valid ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500")} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Consensus Status</span>
        </div>
        <button onClick={checkIntegrity} disabled={loading} className="text-gray-600 hover:text-white transition-colors">
          <RefreshCcw className={cn("w-3 h-3", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[9px] font-mono text-gray-600 uppercase block mb-1">State</span>
          <span className={cn("text-xs font-bold uppercase font-mono", status?.is_valid ? "text-green-500" : "text-red-500")}>
            {loading ? "SYNCING..." : status?.is_valid ? "VERIFIED" : "TAMPERED"}
          </span>
        </div>
        <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[9px] font-mono text-gray-600 uppercase block mb-1">Audit</span>
          <span className="text-xs font-bold font-mono text-white">AUTOMATED</span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-gray-500 leading-relaxed uppercase">
        {status?.message || "Consensus reached. Ledger integrity confirmed across distributed nodes."}
      </div>
    </div>
  );
}

export function BlockCard({ block, index }: { block: Block; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="stealth-card p-5 group hover:border-brand-accent/30 flex flex-col justify-between min-h-[200px]"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-mono text-brand-accent font-bold">BLOCK::{block.index.toString().padStart(4, '0')}</span>
          <p className="text-[10px] text-gray-600 font-mono">{new Date(block.timestamp).toLocaleString()}</p>
        </div>
        <div className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] group-hover:border-brand-accent/20">
          <Database className="w-4 h-4 text-gray-600 group-hover:text-brand-accent transition-colors" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Merkle Root Fragment</span>
          <p className="text-[11px] font-mono text-white/80 break-all leading-tight">
            {block.hash.substring(0, 32)}...
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-0.5 flex-1 bg-white/[0.05] group-hover:bg-brand-accent/10" />
           <CheckCircle className="w-3 h-3 text-green-500/50" />
        </div>
      </div>
    </motion.div>
  );
}

export function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChain = async () => {
    try {
      const data = await proofSealService.getChain();
      setBlocks(data.reverse()); // Latest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChain();
    const interval = setInterval(fetchChain, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="blockchain" className="max-w-7xl mx-auto h-full flex flex-col justify-center px-6">
      <div className="grid lg:grid-cols-[1fr_300px] gap-12 mb-16 items-start">
        <div>
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-px bg-white/[0.1]" />
             <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Public Ledger</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tighter">Audit Trail</h2>
          <p className="text-base md:text-lg text-gray-500 font-light max-w-xl leading-relaxed">
            The immutable record of all cryptographic seals. This public explorer allows anyone to verify the timestamped existence of any previously registered document.
          </p>
        </div>
        <IntegrityDashboard />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[200px] stealth-card animate-pulse bg-white/[0.02]" />
          ))
        ) : blocks.length > 0 ? (
          <AnimatePresence>
            {blocks.map((block, i) => (
              <div key={block.hash}>
                <BlockCard block={block} index={i} />
              </div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 stealth-card flex flex-col items-center justify-center text-gray-600 border-dashed">
            <Cpu className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-mono text-xs uppercase tracking-widest">Genesis Block Awaiting Initialization</p>
          </div>
        )}
      </div>
    </section>
  );
}
