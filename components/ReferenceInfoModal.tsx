import React, { useEffect } from 'react';
import { X, ExternalLink, Info, BookOpen, AlertCircle } from 'lucide-react';

interface ReferenceInfoModalProps {
  onClose: () => void;
}

const observations = [
    {
        title: "OBS 1: Estrutura da Classificação",
        text: "As quatro primeiras colunas da tabela apresentam os campos 'Categoria Econômica', 'Grupo de Natureza da Despesa', 'Modalidade de Aplicação' e 'Elemento de Despesa' e obedecem à codificação e conceitos da Portaria Conjunta nº 163/2001."
    },
    {
        title: "OBS 2: Natureza Exemplificativa",
        text: "As codificações são exemplificativas, podendo ser utilizadas outras combinações. A discriminação das naturezas de despesa pode ser ampliada para atender às necessidades de execução, observados a estrutura e os conceitos da Portaria."
    },
    {
        title: "OBS 3: Desdobramento Municipal",
        text: "As naturezas de despesas apresentadas poderão ser desdobradas conforme a necessidade de registro dos Municípios."
    },
    {
        title: "OBS 4: Versão Consolidada",
        text: "Foi divulgada uma versão consolidada da Portaria Conjunta STN/SOF nº 163/2001 junto à Portaria Conjunta STN/SOF nº 103/2021."
    }
];

const sources = [
    {
        name: "Fonte Principal: TCE-RS (SIAPC)",
        link: "https://tcers.tc.br/sistemas-de-controle-externo/?section=SIAPC"
    },
    {
        name: "Portaria Conjunta STN/SOF nº 163/2001 (Consolidada)",
        link: "https://www.gov.br/tesouronacional/pt-br/contabilidade-e-custos/federacao/portarias"
    },
    {
        name: "Documentação Siconfi (Leiaute da MSC)",
        link: "https://siconfi.tesouro.gov.br/siconfi/pages/public/conteudo/conteudo.jsf?id=12503"
    },
    {
        name: "Manual Técnico do Orçamento da União - MTO - 2026",
        link: "https://www1.siop.planejamento.gov.br/mto/doku.php/mto2026"
    }
];


const ReferenceInfoModal: React.FC<ReferenceInfoModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 id="modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                Fontes e Observações da Base de Dados
                </h3>
                <p className="text-sm text-slate-500 mt-1">NATUREZAS DE DESPESA ORÇAMENTÁRIA 2026 - RS (VERSÃO 1.0)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors absolute right-4 top-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
            <div>
                <h4 className="flex items-center gap-2 text-md font-semibold text-slate-800 mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    Observações Importantes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {observations.map((obs, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200/80 rounded-lg p-4">
                            <p className="font-semibold text-sm text-slate-800 mb-1">{obs.title}</p>
                            <p className="text-sm text-slate-600">{obs.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="flex items-center gap-2 text-md font-semibold text-slate-800 mb-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Fontes de Pesquisa e Documentação Oficial
                </h4>
                <p className="text-sm text-slate-500 mb-4">Os desdobramentos seguem publicações do Governo Federal e a fonte principal é o TCE-RS.</p>
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Publicação</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {sources.map((source, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                                        <p className={`${index === 0 ? 'font-bold text-blue-700' : ''}`}>{source.name}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <a 
                                            href={source.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full border border-blue-200 transition-all"
                                        >
                                            Acessar <ExternalLink className="w-3.5 h-3.5"/>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl flex justify-end">
            <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 border border-transparent text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceInfoModal;
