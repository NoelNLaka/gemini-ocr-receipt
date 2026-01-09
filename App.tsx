
import React, { useState, useCallback } from 'react';
import { AppState, ReceiptData } from './types';
import { scanReceipt } from './services/gemini';
import ReceiptViewer from './components/ReceiptViewer';
import DetailsForm from './components/DetailsForm';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setCapturedImage(base64);
        setAppState('SCANNING');
        setError(null);
        try {
          const data = await scanReceipt(base64);
          setReceiptData(data);
          setAppState('VERIFYING');
        } catch (err) {
          setError("Failed to scan receipt. Please try again.");
          setAppState('IDLE');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    setAppState('SUCCESS');
    // In a real app, this would send data to a backend
    setTimeout(() => {
      setAppState('IDLE');
      setReceiptData(null);
      setCapturedImage(null);
    }, 2000);
  };

  const toggleEdit = () => setIsEditable(!isEditable);

  if (appState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-background-dark">
        <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-5xl">receipt_long</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Scan Your Receipt</h1>
        <p className="text-gray-400 mb-8 max-w-xs">Verify your expenses in seconds with AI-powered scanning.</p>
        
        <label className="w-full max-w-xs h-16 bg-primary rounded-2xl flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all font-bold text-lg shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined mr-2">camera_alt</span>
          Start Scanning
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
        </label>
        
        {error && <p className="mt-4 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg text-sm">{error}</p>}
      </div>
    );
  }

  if (appState === 'SCANNING') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark p-8">
        <div className="relative size-40 mb-8">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-2xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_#3e6b74] animate-[scan_2s_infinite]"></div>
          <div className="flex items-center justify-center h-full opacity-30">
             <span className="material-symbols-outlined text-6xl">qr_code_scanner</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Analyzing Receipt...</h2>
        <p className="text-gray-400">Our AI is extracting the details for you.</p>
        
        <style>{`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (appState === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark p-8 animate-in fade-in zoom-in duration-300">
        <div className="size-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Receipt Verified!</h2>
        <p className="text-gray-400">Your expense has been recorded successfully.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto relative overflow-hidden bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between p-4 z-20 bg-background-dark/80 backdrop-blur-md sticky top-0">
        <button 
          onClick={() => setAppState('IDLE')}
          className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-bold tracking-tight">Verify Receipt</h2>
        <div className="flex gap-2">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-white">share</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {capturedImage && <ReceiptViewer image={capturedImage} />}
        
        {receiptData && (
          <DetailsForm 
            data={receiptData} 
            onChange={setReceiptData} 
            isEditable={isEditable}
          />
        )}
      </main>

      {/* Sticky Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 bg-surface-dark/90 backdrop-blur-xl border-t border-gray-800 z-30">
        <div className="flex gap-3 max-w-[480px] mx-auto">
          <button 
            onClick={toggleEdit}
            className={`flex-1 h-14 rounded-xl border-2 font-bold text-base transition-all ${
              isEditable 
                ? 'bg-accent/10 border-accent text-accent' 
                : 'border-gray-700 text-gray-300 hover:bg-white/5'
            }`}
          >
            {isEditable ? 'Save' : 'Edit'}
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-[2] h-14 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            Confirm Receipt
          </button>
        </div>
        {/* iOS Home Indicator Spacing */}
        <div className="h-4"></div>
      </footer>
    </div>
  );
};

export default App;
