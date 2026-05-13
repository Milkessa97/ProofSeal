import { useState } from 'react';
import { Header } from './components/Layout';
import { Hero } from './components/Hero';
import { ActionHub } from './components/ActionHub';
import { BlockchainExplorer } from './components/ChainList';
import { CertificateModal } from './components/CertificateModal';

export default function App() {
  const [modalData, setModalData] = useState<{ isOpen: boolean; data: any; type: 'seal' | 'verify' }>({
    isOpen: false,
    data: null,
    type: 'seal'
  });

  const handleActionSuccess = (data: any, type: 'seal' | 'verify') => {
    setModalData({
      isOpen: true,
      data,
      type
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent/30 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="snap-section">
          <Hero />
        </div>
        
        <div className="relative">
          {/* Section Divider Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="snap-section">
            <ActionHub onSuccess={handleActionSuccess} />
          </div>
          
          {/* Section Divider Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-20" />
          
          <div className="snap-section">
            <BlockchainExplorer />
          </div>
        </div>
      </main>

      <CertificateModal 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
        data={modalData.data} 
        type={modalData.type} 
      />

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/5 rounded-full blur-[120px]" />
        
        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} 
        />
      </div>
    </div>
  );
}
