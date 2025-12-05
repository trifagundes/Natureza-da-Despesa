import React, { useEffect } from 'react';
import { X, HelpCircle, Search, MessageSquareText, Layers, FileText, ChevronRight } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Guia Rápido de Uso</h2>
                    <p className="text-sm text-slate-500">Gestor Público RS</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Entendendo a Classificação
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    A classificação orçamentária segue uma hierarquia para identificar o destino do gasto público (Natureza da Despesa).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <ConceptCard 
                        title="C.E. - Categoria Econômica" 
                        desc="1º Dígito. Ex: Despesas Correntes (3) ou de Capital (4)." 
                        color="bg-purple-50 border-purple-100 text-purple-700" 
                    />
                    <ConceptCard 
                        title="G.N. - Grupo de Natureza" 
                        desc="2º Dígito. Agrupador macro, como Pessoal (1) ou Investimentos (4)." 
                        color="bg-blue-50 border-blue-100 text-blue-700" 
                    />
                    <ConceptCard 
                        title="Mod. - Modalidade" 
                        desc="3º e 4º Dígitos. Como o recurso é aplicado (ex: Transferências ou Aplicação Direta)." 
                        color="bg-emerald-50 border-emerald-100 text-emerald-700" 
                    />
                    <ConceptCard 
                        title="Elem. - Elemento" 
                        desc="5º e 6º Dígitos. O objeto do gasto (ex: Material de Consumo, Serviços)." 
                        color="bg-orange-50 border-orange-100 text-orange-700" 
                    />
                     <ConceptCard 
                        title="Desd. - Desdobramento" 
                        desc="Dígitos Finais. Especificação detalhada do item para controle do município." 
                        color="bg-slate-50 border-slate-200 text-slate-600" 
                    />
                </div>
            </section>

            <div className="border-t border-slate-100" />

            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Como Usar a Plataforma
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-3">
                             <Search className="w-5 h-5 text-blue-600" />
                             <h4 className="font-semibold text-slate-900">Consulta Manual</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>Use a <strong>barra de busca</strong> para filtrar por código, nome ou descrição.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>Ative os <strong>Filtros Avançados</strong> para refinar por Categoria, Grupo, Modalidade ou Elemento.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>Selecione itens clicando na caixa de seleção e gere um <strong>Relatório PDF</strong> para impressão.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                         <div className="flex items-center gap-2 mb-3">
                             <MessageSquareText className="w-5 h-5 text-blue-600" />
                             <h4 className="font-semibold text-slate-900">Assistente IA</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>Descreva sua necessidade em linguagem natural (ex: "comprar pneus para ambulância" ou "pagar estagiário").</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>A IA analisará a base de dados oficial e sugerirá a melhor classificação com base no histórico.</span>
                            </li>
                             <li className="flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                                <span>Sempre <strong>valide</strong> a sugestão lendo a descrição técnica apresentada.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
             <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
                Entendi, vamos começar
            </button>
        </div>
      </div>
    </div>
  );
};

const ConceptCard = ({ title, desc, color }: { title: string, desc: string, color: string }) => (
    <div className={`p-3 rounded-lg border ${color} flex flex-col h-full`}>
        <span className="font-bold text-xs uppercase mb-1">{title}</span>
        <span className="text-xs leading-tight opacity-90">{desc}</span>
    </div>
);

export default HelpModal;