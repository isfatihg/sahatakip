
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Car, 
  RefreshCw,
  Search,
  ArrowRight,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Table as TableIcon
} from 'lucide-react';

interface ManagerDashboardProps {
  sheetUrl?: string;
  onUpdateUrl: (url: string) => void;
  onLogout: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ sheetUrl, onUpdateUrl, onLogout }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    if (!sheetUrl) return;
    setLoading(true);
    try {
      const response = await fetch(sheetUrl);
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Veriler alınamadı. Lütfen Apps Script URL'nizin v14 olduğundan ve doGet fonksiyonunun çalıştığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sheetUrl]);

  if (!sheetUrl) {
    return (
      <div className="mt-10 max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h3 className="font-black text-slate-900 mb-4 uppercase tracking-tighter">BAĞLANTI GEREKLİ</h3>
        <p className="text-xs text-slate-500 mb-6">Yönetici panelini kullanabilmek için Ayarlar sekmesinden geçerli bir Apps Script URL'si kaydetmiş olmalısınız.</p>
        <button onClick={onLogout} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs">ÇIKIŞ YAP</button>
      </div>
    );
  }

  // Kategorileri (Sheet isimlerini) al
  const categories = data ? Object.keys(data) : [];

  const stats = {
    totalProblems: data?.["Sorunlar"]?.length || 0,
    totalDamage: data?.["Hasar Tespitleri"]?.length || 0,
    totalJobs: data?.["İş Tamamlamalar"]?.reduce((acc: any, curr: any) => acc + (Number(curr["Adet"]) || 0), 0) || 0,
    totalInventory: data?.["Envanter Kayıtları"]?.length || 0,
    activeVehicles: data?.["Araç Kayıtları"]?.length || 0
  };

  const getTeamStats = () => {
    const teams: Record<string, number> = {};
    Object.values(data || {}).forEach((sheetData: any) => {
      if (Array.isArray(sheetData)) {
        sheetData.forEach((row: any) => {
          const team = row["Ekip"];
          if (team) teams[team] = (teams[team] || 0) + 1;
        });
      }
    });
    return Object.entries(teams).sort((a, b) => b[1] - a[1]).slice(0, 10);
  };

  const renderCellValue = (val: any) => {
    if (val === null || val === undefined) return "-";
    
    // Eğer değer bir nesne ise (React'ın hata verdiği durum)
    if (typeof val === 'object') {
      try {
        // Eğer bir tarih nesnesi ise
        if (val instanceof Date) return val.toLocaleString();
        // Değilse JSON string'e çevir
        return JSON.stringify(val);
      } catch (e) {
        return "[Hatalı Veri]";
      }
    }

    const strVal = String(val);
    
    if (strVal.startsWith('=IMAGE')) {
      return <span className="text-blue-500 italic">Görsel (Sheet'te)</span>;
    }

    // Google Maps Link Kontrolü
    if (typeof val === 'string' && val.includes(',') && !isNaN(parseFloat(val.split(',')[0]))) {
      return (
        <a 
          href={`https://www.google.com/maps?q=${val}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 underline font-black"
        >
          KONUM
        </a>
      );
    }

    return strVal;
  };

  const renderTable = (categoryName: string) => {
    const rows = data[categoryName] || [];
    const filteredRows = rows.filter((row: any) => 
      Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filteredRows.length === 0) {
      return (
        <div className="p-20 text-center bg-white border-t border-slate-100">
           <Search size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Sonuç Bulunamadı</p>
        </div>
      );
    }

    const headers = Object.keys(filteredRows[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map(h => (
                <th key={h} className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-tighter whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                {headers.map(h => (
                  <td key={h} className="px-4 py-3 text-[10px] font-bold text-slate-700 whitespace-nowrap">
                    {renderCellValue(row[h])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Main Nav */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-40 space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button 
              onClick={() => setActiveView('overview')} 
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeView === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
            >
              <LayoutDashboard size={14} /> ÖZET
            </button>
            <button 
              onClick={() => setActiveView('teams')} 
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeView === 'teams' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
            >
              <Users size={14} /> EKİPLER
            </button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={fetchData} disabled={loading} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all active:scale-90">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:ring-2 focus:ring-slate-900/5"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveView(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${activeView === cat ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
            >
              {cat} <span className="ml-1 opacity-50">({data[cat]?.length || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: 'SORUNLAR', value: stats.totalProblems, icon: <AlertTriangle size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'HASAR', value: stats.totalDamage, icon: <AlertTriangle size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'TAMAMLANAN', value: stats.totalJobs, icon: <CheckCircle2 size={18} />, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'ENVANTER', value: stats.totalInventory, icon: <TrendingUp size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'ARAÇ', value: stats.activeVehicles, icon: <Car size={18} />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className={`${s.bg} ${s.color} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
                  {s.icon}
                </div>
                <div className="text-xl font-black text-slate-900 leading-none mb-1">{s.value}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Users size={16} className="text-indigo-600" /> EKİP AKTİVİTESİ
              </h4>
              <div className="space-y-4">
                {getTeamStats().slice(0, 5).map(([team, count], idx) => (
                  <div key={team}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-black text-slate-700">{team}</span>
                      <span className="text-[9px] font-black text-indigo-600">{count} İşlem</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${(count / (getTeamStats()[0][1] as number)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-5">
                 <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <Clock size={16} className="text-indigo-600" /> SON İŞLEMLER
                 </h4>
               </div>
               <div className="divide-y divide-slate-100">
                  {categories.flatMap(cat => data[cat].map((log: any) => ({...log, _cat: cat})))
                    .sort((a, b) => b["Zaman Damgası"]?.localeCompare(a["Zaman Damgası"]))
                    .slice(0, 5)
                    .map((log, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center group cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors" onClick={() => setActiveView(log._cat)}>
                         <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-slate-200 rounded-full group-hover:bg-indigo-400 transition-colors"></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-800">{log["Hizmet No"] || log["Proje ID"] || log["Plaka"] || "Genel Kayıt"}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{log._cat} • {log["Ekip"]}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-800">{log["Zaman Damgası"]?.split(' ')[1]}</p>
                            <p className="text-[8px] font-bold text-slate-400">{log["Zaman Damgası"]?.split(' ')[0]}</p>
                         </div>
                      </div>
                    ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
           {getTeamStats().map(([team, count]) => (
              <div key={team} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">
                       {team.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 uppercase tracking-tight text-xs">{team}</h4>
                       <p className="text-[9px] font-bold text-slate-400">AKTİF SAHA EKİBİ</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">KAYIT</p>
                       <p className="text-lg font-black text-slate-900 leading-none">{count}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center">
                       <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">SKOR</p>
                       <p className="text-lg font-black text-emerald-700 leading-none">{(Number(count) * 12).toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {categories.includes(activeView) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
             <div className="flex items-center gap-2">
                <TableIcon size={16} className="text-indigo-400" />
                <h3 className="font-black text-xs uppercase tracking-widest">{activeView} LİSTESİ</h3>
             </div>
             <div className="text-[10px] font-black bg-white/10 px-2 py-1 rounded">
                TOPLAM: {data[activeView]?.length || 0}
             </div>
          </div>
          {renderTable(activeView)}
        </div>
      )}
    </div>
  );
};
