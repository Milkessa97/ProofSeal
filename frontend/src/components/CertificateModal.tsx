import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Download, Calendar, Hash, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { VerificationResult } from '../services/api';
import { cn } from '../lib/utils';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Can be VerificationResult or { hash: string, block: any }
  type: 'seal' | 'verify';
}

export function CertificateModal({ isOpen, onClose, data, type }: CertificateModalProps) {
  if (!isOpen) return null;

  const isVerified = type === 'verify' ? (data as VerificationResult).verified : true;
  const block = type === 'verify' ? (data as VerificationResult).block : (data as any).block;
  const hash = type === 'verify' ? (block?.data_hash || (data as any).hash) : (data as any).hash;

  const handleSaveProof = () => {
    const proofText = `
PROOFSEAL CERTIFICATE
=====================
Status: ${isVerified ? 'VERIFIED' : 'FAILED'}
Hash: ${hash}
Block Index: #${block?.index || '0'}
Timestamp: ${block?.timestamp ? new Date(block.timestamp).toLocaleString() : 'N/A'}
Result: ${isVerified ? 'Document authenticated via blockchain fingerprint.' : 'Cryptographic mismatch: Document not found in ledger.'}
    `;
    const blob = new Blob([proofText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProofSeal_${isVerified ? 'Verified' : 'Failed'}_${hash?.substring(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAccessExplorer = () => {
    onClose();
    setTimeout(() => {
      document.getElementById('blockchain')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "relative w-full max-w-2xl bg-brand-card border overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]",
            isVerified ? "border-white/10" : "border-red-500/30"
          )}
        >
          <div className="absolute inset-0 noise-overlay opacity-[0.02] pointer-events-none" />
          
          {/* Status Glow */}
          <div className={cn(
            "absolute -top-24 -left-24 w-48 h-48 blur-[100px] opacity-20 pointer-events-none",
            isVerified ? "bg-brand-accent" : "bg-red-500"
          )} />

          {/* Header */}
          <div className={cn(
            "p-8 border-b flex items-center justify-between relative z-10",
            isVerified ? "border-white/[0.05]" : "border-red-500/20 bg-red-500/5"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xs flex items-center justify-center transition-colors",
                isVerified ? "bg-white text-black" : "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              )}>
                {isVerified ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={cn(
                  "text-3xl font-bold tracking-tighter",
                  isVerified ? "text-white" : "text-red-500"
                )}>
                  {type === 'seal' ? "ASSET_SEALED" : isVerified ? "HASH_VERIFIED" : "INTEGRITY_FAULT"}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-mono mt-1">
                  {isVerified ? "Protocol: consensus_stable" : "Protocol: cryptographic_mismatch"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Certificate Content */}
          <div className="p-8 relative z-10">
            <div className={cn(
              "p-8 border space-y-8",
              isVerified ? "bg-white/[0.01] border-white/[0.05]" : "bg-red-500/[0.02] border-red-500/10"
            )}>
              <div>
                <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-3 font-bold font-mono">
                  {isVerified ? "Cryptographic Fingerprint" : "Faulty Fingerprint"}
                </label>
                <p className={cn(
                  "text-xs font-mono break-all leading-relaxed p-4 border",
                  isVerified ? "text-white/80 bg-white/[0.02] border-white/[0.03]" : "text-red-400 bg-red-500/[0.03] border-red-500/20"
                )}>
                  {hash || 'MANIFEST_ERROR'}
                </p>
              </div>

              {isVerified ? (
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-2 font-mono">Ledger Context</label>
                      <div className="flex items-center gap-2 font-bold text-lg text-white">
                        <Hash className="w-4 h-4 text-brand-accent" />
                         <span className="font-mono">#{block?.index?.toString().padStart(4, '0') || '0000'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-2 font-mono">Timestamp</label>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {block?.timestamp ? new Date(block.timestamp).toLocaleString() : '---'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end items-end space-y-4">
                    <div className="text-right">
                      <label className="text-[9px] text-gray-600 uppercase tracking-widest block mb-2 font-mono">Validation</label>
                      <div className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs">
                         <CheckCircle2 className="w-4 h-4" />
                         Confirmed
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/10 text-red-500/80 text-xs font-mono uppercase tracking-wider">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>The document submitted does not match any entry in the distributed ledger. It may have been modified or never sealed.</span>
                </div>
              )}

              <div className="pt-8 border-t border-white/[0.05] grid sm:grid-cols-2 gap-4">
                {isVerified && (
                  <button 
                    onClick={handleSaveProof}
                    className="btn-primary flex items-center justify-center gap-2 h-12 text-xs uppercase tracking-widest"
                  >
                    <Download className="w-4 h-4" /> Save Proof
                  </button>
                )}
                <button 
                  onClick={handleAccessExplorer}
                  className={cn(
                    "flex items-center justify-center gap-2 h-12 text-xs uppercase tracking-widest transition-all",
                    isVerified ? "btn-secondary" : "w-full col-span-2 border border-red-500/20 text-red-500 hover:bg-red-500/5"
                  )}
                >
                  {isVerified ? "Access Explorer" : "Audit Full Ledger"}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[8px] font-mono text-gray-700 uppercase tracking-[0.4em]">
              <span>Auth: {isVerified ? "Multi-Node_Sig" : "Validation_Failed"}</span>
              <span>Network: ProofSeal_Mainnet</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
