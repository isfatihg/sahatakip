
import React, { useState, useRef } from 'react';
import { DamageReport } from '../types';
import { Send, Loader2, FileText, Camera, MapPin, X, AlertOctagon, User, History, Wrench } from 'lucide-react';

interface DamageReportFormProps {
  ekipKodu: string;
  sheetUrl?: string;
  onReportAdded: (report: DamageReport) => void;
  onComplete: () => void;
}

export const DamageReportForm: React.FC<DamageReportFormProps> = ({ ekipKodu, sheetUrl, onReportAdded, onComplete }) => {
  const [formData, setFormData] = useState({
    projeId: '',
    hasarYapanAdSoyad: '',
    tcKimlik: '',
    vergiNo: '',
    telNo: '',
    cepTel: '',
    hasarYapanAdres: '',
    hasarTarihi: new Date().toISOString().split('T')[0],
    hasarSaati: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    hasarYeri: '',
    hasarOlusSekli: '',
    tesisCinsiMiktari: '',
    etkilenenAboneSayisi: '',
    duzenleyenPersonel: '',
    duzenleyenUnvan: '',
    tanikBilgileri: '',
    guvenlikGorevlisi: '',
    ihbarEden: '',
    kullanilanMalzemeler: ''
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGettingLocation(false);
      },
      () => {
        alert("Konum alınamadı.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReport: DamageReport = {
      id: crypto.randomUUID(),
      ...formData,
      photo: photo || undefined,
      location: location || undefined,
      ekipKodu,
      timestamp: new Date().toLocaleString('tr-TR'),
      status: 'sent',
      reportType: 'damage_report'
    };

    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(newReport)
        });
      } catch (err) {
        console.error("Damage submission error:", err);
      }
    }

    onReportAdded(newReport);
    setIsSubmitting(false);
    onComplete();
  };

  const sectionClass = "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1";
  const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 font-bold focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-xs";

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="bg-red-600 p-6 text-white text-center">
        <h2 className="text-xl font-black uppercase tracking-tighter flex items-center justify-center gap-3">
          <AlertOctagon size={28} />
          HASAR TESPİT TUTANAĞI
        </h2>
        <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">Türk Telekom Hasar Müdahale ve Kayıt Sistemi</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Tarih</label>
            <input type="date" className={inputClass} value={formData.hasarTarihi} onChange={e => setFormData({...formData, hasarTarihi: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Saat</label>
            <input type="time" className={inputClass} value={formData.hasarSaati} onChange={e => setFormData({...formData, hasarSaati: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Proje ID</label>
            <input type="text" className={inputClass} placeholder="Örn: PRJ-102" value={formData.projeId} onChange={e => setFormData({...formData, projeId: e.target.value})} />
          </div>
        </div>

        <div className={sectionClass}>
          <h4 className="text-[11px] font-black text-red-700 uppercase flex items-center gap-2 mb-4 border-b border-red-100 pb-2">
            <User size={16} /> Hasarı Yapanın Bilgileri
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Adı Soyadı (Ünvanı)</label>
              <input type="text" className={inputClass} value={formData.hasarYapanAdSoyad} onChange={e => setFormData({...formData, hasarYapanAdSoyad: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>T.C. Kimlik / Vergi No</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="T.C." className={inputClass} value={formData.tcKimlik} onChange={e => setFormData({...formData, tcKimlik: e.target.value})} />
                <input type="text" placeholder="Vergi" className={inputClass} value={formData.vergiNo} onChange={e => setFormData({...formData, vergiNo: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Telefon / Cep</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="tel" placeholder="Sabit" className={inputClass} value={formData.telNo} onChange={e => setFormData({...formData, telNo: e.target.value})} />
                <input type="tel" placeholder="Cep" className={inputClass} value={formData.cepTel} onChange={e => setFormData({...formData, cepTel: e.target.value})} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Adresi</label>
              <textarea rows={2} className={inputClass + " resize-none"} value={formData.hasarYapanAdres} onChange={e => setFormData({...formData, hasarYapanAdres: e.target.value})} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h4 className="text-[11px] font-black text-red-700 uppercase flex items-center gap-2 mb-4 border-b border-red-100 pb-2">
            <History size={16} /> Hasar Detayları
          </h4>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Hasarın Yeri (Adres/Saha)</label>
              <input type="text" className={inputClass} value={formData.hasarYeri} onChange={e => setFormData({...formData, hasarYeri: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Hasarın Oluş Şekli</label>
              <textarea rows={2} className={inputClass + " resize-none"} value={formData.hasarOlusSekli} onChange={e => setFormData({...formData, hasarOlusSekli: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Tesis/Araç Cinsi ve Miktarı</label>
              <input type="text" className={inputClass} placeholder="Örn: 100m Fiber Kablo, 2 Direk" value={formData.tesisCinsiMiktari} onChange={e => setFormData({...formData, tesisCinsiMiktari: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Çalışmayan Abone Sayısı</label>
              <input type="number" className={inputClass} value={formData.etkilenenAboneSayisi} onChange={e => setFormData({...formData, etkilenenAboneSayisi: e.target.value})} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h4 className="text-[11px] font-black text-red-700 uppercase flex items-center gap-2 mb-4 border-b border-red-100 pb-2">
            <FileText size={16} /> Tutanağı Düzenleyen & Yetkililer
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Personel Ad Soyad</label>
              <input type="text" className={inputClass} value={formData.duzenleyenPersonel} onChange={e => setFormData({...formData, duzenleyenPersonel: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Ünvanı</label>
              <input type="text" className={inputClass} value={formData.duzenleyenUnvan} onChange={e => setFormData({...formData, duzenleyenUnvan: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Tanıklar (Ad/Ünvan/Kurum)</label>
              <input type="text" className={inputClass} value={formData.tanikBilgileri} onChange={e => setFormData({...formData, tanikBilgileri: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Güvenlik (Polis/Jandarma)</label>
              <input type="text" className={inputClass} value={formData.guvenlikGorevlisi} onChange={e => setFormData({...formData, guvenlikGorevlisi: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>İhbar Eden</label>
              <input type="text" className={inputClass} value={formData.ihbarEden} onChange={e => setFormData({...formData, ihbarEden: e.target.value})} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h4 className="text-[11px] font-black text-red-700 uppercase flex items-center gap-2 mb-4 border-b border-red-100 pb-2">
            <Wrench size={16} /> Kullanılan Malzemeler
          </h4>
          <textarea rows={3} className={inputClass + " resize-none font-mono"} value={formData.kullanilanMalzemeler} onChange={e => setFormData({...formData, kullanilanMalzemeler: e.target.value})} placeholder="Kullanılan kablo, ek kutusu, direk vb. detayları..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-4 rounded-xl transition-all ${photo ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200'}`}>
            <Camera size={24} />
            <span className="text-[10px] font-black uppercase tracking-wider">{photo ? 'FOTOĞRAF TAMAM' : 'HASAR FOTOSU ÇEK'}</span>
          </button>
          <button type="button" onClick={handleGetLocation} className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-4 rounded-xl transition-all ${location ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200'}`}>
            {gettingLocation ? <Loader2 className="animate-spin" size={24} /> : <MapPin size={24} />}
            <span className="text-[10px] font-black uppercase tracking-wider">{location ? 'KONUM KAYDEDİLDİ' : 'GPS KONUM EKLE'}</span>
          </button>
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
        </div>

        {photo && (
          <div className="relative rounded-xl overflow-hidden border-2 border-red-100 shadow-lg">
            <img src={photo} alt="Hasar Kanıtı" className="w-full h-48 object-cover" />
            <button type="button" onClick={() => setPhoto(null)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"><X size={16} /></button>
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl hover:bg-black uppercase tracking-widest text-lg border-b-4 border-slate-700"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <FileText size={28} />}
          TUTANAĞI SİSTEME KAYDET
        </button>
      </form>
    </div>
  );
};
