
import React, { useState, useRef } from 'react';
import { InventoryLog, InventoryAction } from '../types';
import { Package, Scan, Hash, ChevronRight, Loader2, CheckCircle2, Inbox, Send, RotateCcw, Monitor } from 'lucide-react';

interface InventoryFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onLogAdded: (log: InventoryLog) => void;
  onComplete: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ ekipKodu, sheetUrl, onLogAdded, onComplete }) => {
  const [actionType, setActionType] = useState<InventoryAction>('receive');
  const [formData, setFormData] = useState({
    serialNumber: '',
    hizmetNo: '',
    deviceType: 'MODEM'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanner = async () => {
    setScanMode(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Kameraya erişilemedi.");
      setScanMode(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setScanMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber) {
      alert("Lütfen seri numarası girin.");
      return;
    }
    if ((actionType === 'install' || actionType === 'return') && !formData.hizmetNo) {
      alert("Bu işlem için Hizmet No gereklidir.");
      return;
    }

    setIsSubmitting(true);

    const newLog: InventoryLog = {
      id: crypto.randomUUID(),
      actionType,
      serialNumber: formData.serialNumber.toUpperCase(),
      hizmetNo: formData.hizmetNo || undefined,
      deviceType: formData.deviceType,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'inventory'
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(newLog)
        });
      } catch (err) {
        console.error(err);
      }
    }

    onLogAdded(newLog);
    setIsSubmitting(false);
    setFormData({ ...formData, serialNumber: '', hizmetNo: '' });
    new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3').play().catch(() => {});
  };

  const actionConfig = {
    receive: { label: 'Depodan Teslim Al', color: 'bg-emerald-600', icon: <Inbox size={20}/> },
    install: { label: 'Müşteriye Kurulum', color: 'bg-indigo-600', icon: <Send size={20}/> },
    return: { label: 'Arızalı İade Al', color: 'bg-red-600', icon: <RotateCcw size={20}/> }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className={`${actionConfig[actionType].color} p-6 text-white text-center transition-colors duration-500`}>
        <h3 className="font-black flex items-center justify-center gap-3 text-xl uppercase tracking-tighter">
          <Package size={28} />
          ENVANTER HAREKETİ
        </h3>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">{actionConfig[actionType].label}</p>
      </div>

      <div className="p-1 flex border-b border-slate-100 bg-slate-50">
        {(['receive', 'install', 'return'] as InventoryAction[]).map((type) => (
          <button
            key={type}
            onClick={() => setActionType(type)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${
              actionType === type ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-400'
            }`}
          >
            {type === 'receive' ? 'TESLİM AL' : type === 'install' ? 'KURULUM' : 'İADE AL'}
          </button>
        ))}
      </div>

      <div className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {(actionType === 'install' || actionType === 'return') && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hizmet Numarası</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                    value={formData.hizmetNo} 
                    onChange={e => setFormData({...formData, hizmetNo: e.target.value})} 
                    placeholder="88219..." 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cihaz Seri No / Barcode</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required 
                    type="text" 
                    autoCapitalize="characters"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all uppercase" 
                    value={formData.serialNumber} 
                    onChange={e => setFormData({...formData, serialNumber: e.target.value})} 
                    placeholder="TT123456789" 
                  />
                </div>
                <button 
                  type="button"
                  onClick={startScanner}
                  className="bg-slate-900 text-white p-4 rounded-xl hover:bg-black active:scale-95 transition-all shadow-lg"
                >
                  <Scan size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cihaz Tipi</label>
              <div className="grid grid-cols-2 gap-2">
                {['MODEM', 'GPON', 'DECO', 'STB'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, deviceType: type})}
                    className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${
                      formData.deviceType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full ${actionConfig[actionType].color} text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:brightness-110 uppercase tracking-widest text-lg border-b-4 border-black/20`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : actionConfig[actionType].icon}
            İŞLEMİ KAYDET
          </button>
        </form>
      </div>

      {scanMode && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-md absolute top-0 w-full z-10">
            <h4 className="text-white font-black text-xs tracking-widest uppercase">BARCODE OKUTULUYOR</h4>
            <button onClick={stopScanner} className="text-white p-2 bg-red-600 rounded-full"><RotateCcw size={20}/></button>
          </div>
          <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 border-4 border-white/50 rounded-2xl relative">
              <div className="absolute inset-0 border-2 border-red-500/50 animate-pulse"></div>
              <div className="absolute top-1/2 w-full h-0.5 bg-red-500 animate-bounce"></div>
            </div>
          </div>
          <div className="p-8 bg-black/50 backdrop-blur-md absolute bottom-0 w-full text-center">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Lütfen cihaz üzerindeki barkodu kare içerisine odaklayın</p>
          </div>
        </div>
      )}
    </div>
  );
};
