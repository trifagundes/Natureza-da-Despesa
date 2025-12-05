import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExpenseList from './components/ExpenseList';
import GeminiAdvisor from './components/GeminiAdvisor';
import ReferenceInfoModal from './components/ReferenceInfoModal';
import HelpModal from './components/HelpModal';
import { fetchExpenses } from './services/data';
import { ExpenseEntry } from './types';
import { Loader2, AlertCircle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'search' | 'advisor'>('search');
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReferenceInfo, setShowReferenceInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchExpenses();
        if (data.length <= 1) {
           console.warn("Usando dados de fallback ou a base está vazia.");
        }
        setExpenses(data);
      } catch (err) {
        setError("Não foi possível carregar a base de dados atualizada. Verifique sua conexão.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-medium">Carregando base de dados (Manual 2026)...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden">
      <Navbar 
        currentView={view} 
        setView={setView} 
        onOpenHelp={() => setShowHelp(true)} 
      />
      
      <main className="flex-1 overflow-y-auto w-full relative">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
             <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
             </div>
          </div>
        )}
        
        <div className="h-full">
            {view === 'search' ? (
                <ExpenseList expenses={expenses} />
            ) : (
                <GeminiAdvisor expenses={expenses} />
            )}
        </div>
      </main>

      <footer className="bg-slate-800 text-slate-400 text-xs text-center p-3 border-t border-slate-700 shrink-0 z-10">
        <button 
          onClick={() => setShowReferenceInfo(true)}
          className="hover:text-white transition-colors flex items-center justify-center mx-auto gap-2 py-1 px-3 rounded hover:bg-slate-700"
        >
          <Info className="w-4 h-4" />
          <span>Fontes e Observações da Base de Dados</span>
        </button>
      </footer>

      {showReferenceInfo && (
        <ReferenceInfoModal onClose={() => setShowReferenceInfo(false)} />
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};

export default App;