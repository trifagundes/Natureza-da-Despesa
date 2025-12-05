import React from 'react';
import { BookOpen, MessageSquareText, Search, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentView: 'search' | 'advisor';
  setView: (view: 'search' | 'advisor') => void;
  onOpenHelp: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onOpenHelp }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-lg">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Bras%C3%A3o_rio_grande_do_sul.png?20110806101059" alt="RS" className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg tracking-tight">Naturezas de Despesa 2026 1.0 - TCE/RS - (não oficial)</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setView('search')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'search'
                  ? 'bg-slate-800 text-yellow-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 mr-2" />
              Consulta
            </button>
            <button
              onClick={() => setView('advisor')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'advisor'
                  ? 'bg-slate-800 text-yellow-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquareText className="w-4 h-4 mr-2" />
              Assistente IA
            </button>
            <div className="h-full py-2">
                <div className="w-px h-full bg-slate-700 mx-2"></div>
            </div>
            <button
                onClick={onOpenHelp}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Guia Rápido de Ajuda"
            >
                <HelpCircle className="w-5 h-5 mr-2" />
                Ajuda
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;