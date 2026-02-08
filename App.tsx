
import React, { useState, useEffect } from 'react';
import { PINEntry } from './components/PINEntry';
import { Dashboard } from './components/Dashboard';
import { AppState, Report, ImprovementReport, ModemSetupReport, DamageReport, JobCompletionReport, VehicleLog, PortChangeReport, InventoryLog } from './types';
import { HardHat } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('saharapor_state_v9');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: false,
      ekipKodu: '',
      reports: [],
      improvementReports: [],
      modemReports: [],
      damageReports: [],
      jobCompletions: [],
      vehicleLogs: [],
      portChanges: [],
      inventoryLogs: [],
      sheetUrl: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('saharapor_state_v9', JSON.stringify(state));
  }, [state]);

  const handleLogin = (pin: string) => {
    setState(prev => ({
      ...prev,
      isLoggedIn: true,
      ekipKodu: pin
    }));
  };

  const handleLogout = () => {
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
      ekipKodu: ''
    }));
  };

  const addReport = (newReport: Report) => {
    setState(prev => ({ ...prev, reports: [newReport, ...prev.reports] }));
  };

  const addImprovementReport = (newReport: ImprovementReport) => {
    setState(prev => ({ ...prev, improvementReports: [newReport, ...prev.improvementReports] }));
  };

  const addModemReport = (newReport: ModemSetupReport) => {
    setState(prev => ({ ...prev, modemReports: [newReport, ...prev.modemReports] }));
  };

  const addDamageReport = (newReport: DamageReport) => {
    setState(prev => ({ ...prev, damageReports: [newReport, ...prev.damageReports] }));
  };

  const addJobCompletion = (newReport: JobCompletionReport) => {
    setState(prev => ({ ...prev, jobCompletions: [newReport, ...prev.jobCompletions] }));
  };

  const addVehicleLog = (newLog: VehicleLog) => {
    setState(prev => ({ ...prev, vehicleLogs: [newLog, ...prev.vehicleLogs] }));
  };

  const addPortChange = (newReport: PortChangeReport) => {
    setState(prev => ({ ...prev, portChanges: [newReport, ...prev.portChanges] }));
  };

  const addInventoryLog = (newLog: InventoryLog) => {
    setState(prev => ({ ...prev, inventoryLogs: [newLog, ...prev.inventoryLogs] }));
  };

  const updateSheetUrl = (url: string) => {
    setState(prev => ({ ...prev, sheetUrl: url }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <HardHat size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SahaRapor</h1>
          </div>
          {state.isLoggedIn && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-400 hidden sm:inline">
                Ekip: <span className="text-white font-mono">{state.ekipKodu}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors font-bold"
              >
                Çıkış
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {!state.isLoggedIn ? (
          <PINEntry onLogin={handleLogin} />
        ) : (
          <Dashboard 
            {...state}
            onReportAdded={addReport} 
            onImprovementReportAdded={addImprovementReport}
            onModemReportAdded={addModemReport}
            onDamageReportAdded={addDamageReport}
            onJobCompletionAdded={addJobCompletion}
            onVehicleLogAdded={addVehicleLog}
            onPortChangeAdded={addPortChange}
            onInventoryLogAdded={addInventoryLog}
            onUpdateSheetUrl={updateSheetUrl}
          />
        )}
      </main>

      <footer className="bg-white border-t p-4 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} SahaRapor - Türk Telekom Saha Operasyonları
      </footer>
    </div>
  );
};

export default App;
