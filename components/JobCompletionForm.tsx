
import React, { useState } from 'react';
import { JobCompletionReport } from '../types';
// Fixed: Removed non-existent and unused 'Tool' and 'Send' icon imports from lucide-react
import { Loader2, CheckCircle2, ListOrdered, TrendingUp, Activity } from 'lucide-react';

interface JobCompletionFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  jobCompletions: JobCompletionReport[];
  onReportAdded: (report: JobCompletionReport) => void;
  onComplete: () => void;
}

export const JobCompletionForm: React.FC<JobCompletionFormProps> = ({ 
  ekipKodu, 
  sheetUrl, 
  jobCompletions,
  onReportAdded, 
  onComplete 
}) => {
  const [hizmetNo, setHizmetNo] = useState('');
  const [isTipi, setIsTipi] = useState<'ARIZA' | 'TESİS'>('ARIZA');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sayaçları hesapla
  const arizaCount = jobCompletions.filter(jc => jc.isTipi === 'ARIZA').reduce((acc, curr) => acc + curr.isAdedi, 0);
  const tesisCount = jobCompletions.filter(jc => jc.isTipi === 'TESİS').reduce((acc, curr) => acc + curr.isAdedi, 0);
  const totalCount = arizaCount + tesisCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hizmetNo) {
      alert("Lütfen Hizmet Numarası girin.");
      return;
    }
    
    setIsSubmitting(true);

    const newReport: JobCompletionReport = {
      id: crypto.randomUUID(),
      hizmetNo,
      isTipi,
      isAdedi: 1, // Her işlem 1 adet sayılır
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'job_completion'
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
    setHizmetNo(''); // Hizmet numarasını temizle ki yeni kayıt girilebilsin
    
    // Opsiyonel: Başarı bildirimi
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(() => {}); // Ses çalma hatasını yoksay
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-orange-600 p-6 text-white text-center">
        <h3 className="font-black flex items-center justify-center gap-3 text-xl uppercase tracking-tighter">
          <ListOrdered size={28} />
          İŞ TAMAMLAMA & SAYAÇLAR
        </h3>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Her işlemde sayaç otomatik artar</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Canlı Sayaç Paneli */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest block mb-1">ARIZA</span>
            <div className="text-3xl font-black text-orange-700 tabular-nums">{arizaCount}</div>
            <Activity size={14} className="mx-auto mt-1 text-orange-300" />
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center shadow-sm">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest block mb-1">TESİS</span>
            <div className="text-3xl font-black text-blue-700 tabular-nums">{tesisCount}</div>
            <TrendingUp size={14} className="mx-auto mt-1 text-blue-300" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center shadow-md">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">TOPLAM</span>
            <div className="text-3xl font-black text-white tabular-nums">{totalCount}</div>
            <div className="w-4 h-1 bg-orange-500 mx-auto mt-2 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Hizmet Numarası</label>
              <input 
                required 
                type="text" 
                inputMode="numeric"
                className="w-full px-4 py-5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-bold focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-xl shadow-inner text-center tracking-widest" 
                value={hizmetNo} 
                onChange={e => setHizmetNo(e.target.value)} 
                placeholder="Örn: 88219..." 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 text-center">İş Tipi Seçimi</label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setIsTipi('ARIZA')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all ${
                    isTipi === 'ARIZA' 
                      ? 'bg-orange-600 text-white shadow-lg scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Activity size={18} />
                  ARIZA
                </button>
                <button
                  type="button"
                  onClick={() => setIsTipi('TESİS')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all ${
                    isTipi === 'TESİS' 
                      ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <TrendingUp size={18} />
                  TESİS
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-2xl hover:bg-black uppercase tracking-widest text-xl border-b-8 border-slate-700"
            >
              <div className="flex items-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" size={32} /> : <CheckCircle2 size={32} className="text-orange-500" />}
                İŞİ SİSTEME İŞLE
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Kayıt sonrası sayaç {isTipi === 'ARIZA' ? 'Arıza' : 'Tesis'} için artacaktır</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center gap-3">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <TrendingUp size={20} />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
            Günlük performansınız yukarıdaki sayaçlarda anlık olarak güncellenir. <br/>
            Hatalı kayıt durumunda "Geçmiş" sekmesinden kontrol sağlayabilirsiniz.
        </p>
      </div>
    </div>
  );
};
