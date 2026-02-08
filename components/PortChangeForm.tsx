
import React, { useState } from 'react';
import { PortChangeReport } from '../types';
import { Send, Loader2, CheckCircle2, Shuffle, Hash, Layers } from 'lucide-react';

interface PortChangeFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: PortChangeReport) => void;
  onComplete: () => void;
}

export const PortChangeForm: React.FC<PortChangeFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [formData, setFormData] = useState({
    hizmetNo: '',
    yeniPort: '',
    yeniDevre: '',
    aciklama: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hizmetNo || (!formData.yeniPort && !formData.yeniDevre)) {
      alert("Lütfen Hizmet No ve en az bir yeni bilgi (Port veya Devre) girin.");
      return;
    }
    
    setIsSubmitting(true);

    const newReport: PortChangeReport = {
      id: crypto.randomUUID(),
      ...formData,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'port_change'
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(newReport)
        });
      } catch (err) {
        console.error(err);
      }
    }

    onReportAdded(newReport);
    setIsSubmitting(false);
    onComplete();
  };

  const inputClass = "w-full px-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm shadow-sm";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest";

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-violet-700 p-6 text-white text-center">
        <h3 className="font-black flex items-center justify-center gap-3 text-xl uppercase tracking-tighter">
          <Shuffle size={28} />
          PORT / DEVRE DEĞİŞİKLİĞİ
        </h3>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Yeni port ve devre bilgilerini işleyin</p>
      </div>

      <div className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className={labelClass}>Hizmet Numarası</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                type="text" 
                className={inputClass + " pl-12"} 
                value={formData.hizmetNo} 
                onChange={e => setFormData({...formData, hizmetNo: e.target.value})} 
                placeholder="Örn: 88219..." 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Yeni Port Bilgisi</label>
              <div className="relative">
                <Shuffle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  className={inputClass + " pl-12"} 
                  value={formData.yeniPort} 
                  onChange={e => setFormData({...formData, yeniPort: e.target.value})} 
                  placeholder="Slot-Port / Örn: 1-15" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Yeni Devre Bilgisi</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  className={inputClass + " pl-12"} 
                  value={formData.yeniDevre} 
                  onChange={e => setFormData({...formData, yeniDevre: e.target.value})} 
                  placeholder="Örn: V-101 / D-202" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Açıklama / Değişim Nedeni</label>
            <textarea 
              rows={3} 
              className={inputClass + " resize-none font-medium"} 
              value={formData.aciklama} 
              onChange={e => setFormData({...formData, aciklama: e.target.value})} 
              placeholder="Port arızası, devre yükseltme vb..." 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-black uppercase tracking-widest text-lg border-b-4 border-slate-700"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={28} className="text-violet-400" />}
            DEĞİŞİKLİĞİ KAYDET
          </button>
        </form>
      </div>
    </div>
  );
};
