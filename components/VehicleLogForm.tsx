
import React, { useState } from 'react';
import { VehicleLog } from '../types';
import { Car, Gauge, CheckCircle2, Loader2, Info } from 'lucide-react';

interface VehicleLogFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: VehicleLog) => void;
  onComplete: () => void;
}

export const VehicleLogForm: React.FC<VehicleLogFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [plaka, setPlaka] = useState('');
  const [kilometre, setKilometre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plaka || !kilometre) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    
    setIsSubmitting(true);

    const newLog: VehicleLog = {
      id: crypto.randomUUID(),
      plaka: plaka.toUpperCase(),
      kilometre: Number(kilometre),
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'vehicle_log'
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(newLog)
        });
      } catch (err) {
        console.error(err);
      }
    }

    onReportAdded(newLog);
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-cyan-700 p-6 text-white text-center">
        <h3 className="font-black flex items-center justify-center gap-3 text-xl uppercase tracking-tighter">
          <Car size={28} />
          İŞ BAŞI & ARAÇ KAYDI
        </h3>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Mesai başlangıcında plaka ve KM girin</p>
      </div>

      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Araç Plakası</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required 
                  type="text" 
                  autoCapitalize="characters"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-cyan-600 focus:ring-4 focus:ring-cyan-50 outline-none transition-all text-lg uppercase" 
                  value={plaka} 
                  onChange={e => setPlaka(e.target.value)} 
                  placeholder="34 ABC 123" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Güncel Kilometre</label>
              <div className="relative">
                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  required 
                  type="number" 
                  inputMode="numeric"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-cyan-600 focus:ring-4 focus:ring-cyan-50 outline-none transition-all text-lg" 
                  value={kilometre} 
                  onChange={e => setKilometre(e.target.value)} 
                  placeholder="000000" 
                />
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 flex items-start gap-3">
              <Info size={20} className="text-cyan-700 mt-0.5 shrink-0" />
              <p className="text-[10px] text-cyan-800 font-bold leading-relaxed uppercase">
                  Araç plakası ve kilometre kaydı mesai takibi ve yakıt kontrolü için gereklidir. Lütfen doğru veri giriniz.
              </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-black uppercase tracking-widest text-lg border-b-4 border-slate-700"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={28} className="text-cyan-400" />}
            İŞ BAŞI YAP VE KAYDET
          </button>
        </form>
      </div>
    </div>
  );
};
