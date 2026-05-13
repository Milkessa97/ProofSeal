import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSearch, ShieldCheck, Loader2, AlertCircle, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { proofSealService } from '../services/api';
import { cn } from '../lib/utils';

interface ActionHubProps {
  onSuccess: (data: any, type: 'seal' | 'verify') => void;
}

export function ActionHub({ onSuccess }: ActionHubProps) {
  const [activeTab, setActiveTab] = useState<'seal' | 'verify'>('seal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setError(null);
    setIsProcessing(true);
    const file = acceptedFiles[0];

    try {
      if (activeTab === 'seal') {
        const result = await proofSealService.uploadFile(file);
        onSuccess(result, 'seal');
      } else {
        const result = await proofSealService.verifyFile(file);
        onSuccess(result, 'verify');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Network error: Unable to connect to verification node.');
    } finally {
      setIsProcessing(false);
    }
  }, [activeTab, onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isProcessing
  } as any);

  return (
    <section id="action-hub" className="max-w-6xl mx-auto h-full flex items-center px-6">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start w-full">
        {/* Control Panel */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Trust Terminal</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Select an operation. All files are hashed locally in your browser to ensure absolute privacy.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xs">
            <button
              onClick={() => setActiveTab('seal')}
              className={cn(
                "w-full px-6 py-4 text-xs font-bold uppercase tracking-widest text-left transition-all flex items-center justify-between group",
                activeTab === 'seal' ? "bg-white text-black" : "text-gray-500 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                <span>01. Seal New Document</span>
              </div>
              {activeTab === 'seal' && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />}
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={cn(
                "w-full px-6 py-4 text-xs font-bold uppercase tracking-widest text-left transition-all flex items-center justify-between group",
                activeTab === 'verify' ? "bg-white text-black" : "text-gray-500 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <FileSearch className="w-4 h-4" />
                <span>02. Verify Authenticity</span>
              </div>
              {activeTab === 'verify' && <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />}
            </button>
          </div>

          <div className="p-6 stealth-card space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-brand-accent" />
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Protocol Details</span>
            </div>
            <div className="h-px bg-white/[0.05]" />
            <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
              ALGORITHM: SHA-256 <br />
              STORAGE: IMMUTABLE LEDGER <br />
              PRIVACY: ZERO-FILE UPLOAD (HASH ONLY)
            </p>
          </div>
        </div>

        {/* Input Terminal */}
        <div className="relative group">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brand-accent/30" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brand-accent/30" />

          <div
            {...getRootProps()}
            className={cn(
              "stealth-card relative min-h-[320px] md:min-h-[400px] flex flex-col items-center justify-center border-dashed border-white/[0.08] hover:border-brand-accent/40 cursor-crosshair overflow-hidden p-8 md:p-12",
              isDragActive && "bg-brand-accent/[0.02] border-brand-accent/60",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative w-24 h-24 mb-12">
                    <div className="absolute inset-0 rounded-full border-t-2 border-brand-accent animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-mono text-white mb-2 uppercase tracking-widest">Generating Hash...</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Running cryptographic protocol</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center max-w-sm"
                >
                  <div className="w-16 h-16 mb-8 relative">
                    <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full animate-pulse" />
                    {activeTab === 'seal' ? <Upload className="relative w-16 h-16 text-white stroke-[1px]" /> : <FileSearch className="relative w-16 h-16 text-white stroke-[1px]" />}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {isDragActive ? "Release to process" : activeTab === 'seal' ? "Seal Document" : "Verify Document"}
                  </h3>
                  <p className="text-sm text-gray-500 font-light mb-8 leading-relaxed">
                    {activeTab === 'seal' 
                      ? "Drop your file to generate a permanent cryptographic proof of existence. No file data is ever uploaded."
                      : "Drop a file to check if it has been previously recorded on the blockchain and verify its integrity."}
                  </p>
                  <button className="btn-secondary text-[10px] font-bold uppercase tracking-[0.2em] px-12">
                    Browse Files
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute bottom-8 left-8 right-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-mono flex items-center gap-3 uppercase tracking-wider"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
