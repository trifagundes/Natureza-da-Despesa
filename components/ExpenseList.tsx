import React, { useState, useMemo, useEffect, useRef } from 'react';
import { searchExpenses } from '../services/data';
import { GRUPOS_NATUREZA, MODALIDADES_APLICACAO, ELEMENTOS_DESPESA, getCategoriaDescription, getGrupoDescription, getModalidadeInfo, getElementoDescription } from '../services/referenceData';
import { ExpenseEntry } from '../types';
import { Search, FileText, Info, X, ChevronRight, Filter, CheckSquare, Square, Printer, HelpCircle, ChevronDown, ChevronUp, Layers, LayoutGrid, Shuffle, Puzzle } from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseEntry[];
}

const ITEMS_PER_PAGE = 50;

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'code' | 'name' | 'description'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'S' | 'A'>('all');
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCE, setFilterCE] = useState<string>('all');
  const [filterG, setFilterG] = useState<string>('all');
  const [filterM, setFilterM] = useState<string>('all');
  const [filterE, setFilterE] = useState<string>('all');

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showReport, setShowReport] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilterG('all');
  }, [filterCE]);
  
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, filterType, categoryFilter, filterCE, filterG, filterM, filterE]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  const allResults = useMemo(() => {
    return searchExpenses(expenses, searchTerm, filterType, categoryFilter, filterCE, filterG, filterM, filterE);
  }, [searchTerm, filterType, categoryFilter, filterCE, filterG, filterM, filterE, expenses]);
  
  const availableGroups = useMemo(() => {
      if (filterCE === 'all') {
          const uniqueGroups = [...new Map(GRUPOS_NATUREZA.map(item => [item.CD_NATUREZA, item])).values()];
          return uniqueGroups.sort((a,b) => a.CD_NATUREZA - b.CD_NATUREZA);
      }
      if (filterCE === 'reservas') {
          return GRUPOS_NATUREZA.filter(g => g.CD_CATEGORIA_ECONOMICA === 7 || g.CD_CATEGORIA_ECONOMICA === 9);
      }
      return GRUPOS_NATUREZA.filter(g => g.CD_CATEGORIA_ECONOMICA.toString() === filterCE);
  }, [filterCE]);

  const visibleResults = allResults.slice(0, visibleCount);
  const totalResults = allResults.length;

  const toggleSelection = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedItems);
    if (newSet.has(code)) {
      newSet.delete(code);
    } else {
      newSet.add(code);
    }
    setSelectedItems(newSet);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const reportItems = useMemo(() => {
    return expenses.filter(e => selectedItems.has(e.code));
  }, [expenses, selectedItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedExpense(null);
        setShowReport(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Consulta de Natureza de Despesa</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Pesquise pelo código, nome ou descrição da despesa para encontrar a classificação orçamentária correta conforme o manual 2026.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Base de dados sincronizada com a planilha oficial do TCE-RS.
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-6 space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
              placeholder="Digite sua busca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-40">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-500" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="block w-full pl-9 pr-8 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">Todos campos</option>
              <option value="code">Código</option>
              <option value="name">Nome</option>
              <option value="description">Descrição</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
               <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative md:w-40">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="block w-full pl-9 pr-8 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">Ambas Cat.</option>
              <option value="S">Sintética</option>
              <option value="A">Analítica</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
               <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
            <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
                {showAdvancedFilters ? (
                    <>
                        <ChevronUp className="w-4 h-4 mr-1" /> Ocultar Filtros Avançados
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4 mr-1" /> Mostrar Filtros Avançados
                    </>
                )}
            </button>
        </div>

        {showAdvancedFilters && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Classificação da Despesa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Categoria Econômica */}
                    <FilterDropdown 
                        label="Categoria Econômica" 
                        icon={<Layers className="h-4 w-4 text-slate-500" />} 
                        value={filterCE} 
                        onChange={setFilterCE}
                        options={[
                            { value: 'all', label: 'Todas as Categorias' },
                            { value: '3', label: '3 - Despesas Correntes' },
                            { value: '4', label: '4 - Despesas de Capital' },
                            { value: 'reservas', label: 'Reservas (7 e 9)' },
                        ]}
                    />
                    {/* Grupo de Natureza */}
                    <FilterDropdown 
                        label="Grupo de Natureza" 
                        icon={<LayoutGrid className="h-4 w-4 text-slate-500" />} 
                        value={filterG} 
                        onChange={setFilterG}
                        options={[
                            { value: 'all', label: 'Todos os Grupos' },
                            ...availableGroups.map(g => ({ value: g.CD_NATUREZA.toString(), label: `${g.CD_NATUREZA} - ${g.DS_GRUPO_NATUREZA}` }))
                        ]}
                        disabled={availableGroups.length === 0}
                    />
                    {/* Modalidade de Aplicação */}
                    <FilterDropdown 
                        label="Modalidade de Aplicação" 
                        icon={<Shuffle className="h-4 w-4 text-slate-500" />} 
                        value={filterM} 
                        onChange={setFilterM}
                        options={[
                            { value: 'all', label: 'Todas as Modalidades' },
                            ...MODALIDADES_APLICACAO.map(m => ({ value: m.CD_MODALIDADE.toString(), label: `${m.CD_MODALIDADE} - ${m.NM_MODALIDADE}` }))
                        ]}
                    />
                    {/* Elemento de Despesa */}
                    <FilterDropdown 
                        label="Elemento de Despesa" 
                        icon={<Puzzle className="h-4 w-4 text-slate-500" />} 
                        value={filterE} 
                        onChange={setFilterE}
                        options={[
                            { value: 'all', label: 'Todos os Elementos' },
                            ...ELEMENTOS_DESPESA.map(e => ({ value: e.CD_ELEMENTO.toString(), label: `${e.CD_ELEMENTO} - ${e.NM_ELEMENTO}` }))
                        ]}
                    />
                </div>
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
          <div>
            {searchTerm.trim() || filterCE !== 'all' || categoryFilter !== 'all' || filterG !== 'all' || filterM !== 'all' || filterE !== 'all' ? (
                <span>Encontrados <strong>{totalResults}</strong> resultados</span>
            ) : (
                <span>Total de <strong>{expenses.length}</strong> registros na base.</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {selectedItems.size > 0 && (
              <span className="text-blue-600 font-medium">{selectedItems.size} item(s) selecionado(s)</span>
            )}
            <button
              onClick={() => setShowReport(true)}
              disabled={selectedItems.size === 0}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedItems.size > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Printer className="w-4 h-4" />
              Gerar Relatório
            </button>
             {selectedItems.size > 0 && (
                <button 
                  onClick={clearSelection}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Limpar seleção"
                >
                  <X className="w-5 h-5" />
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleResults.map((item, index) => {
          const isSelected = selectedItems.has(item.code);
          return (
            <div
              key={`${item.code}-${index}`}
              onClick={() => setSelectedExpense(item)}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group relative ${
                isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:shadow-md hover:border-blue-300'
              }`}
            >
              <div 
                className="absolute top-3 right-3 z-10 text-slate-300 hover:text-blue-500 transition-colors"
                onClick={(e) => toggleSelection(item.code, e)}
              >
                {isSelected ? (
                   <CheckSquare className="w-6 h-6 text-blue-600 fill-blue-50" />
                ) : (
                   <Square className="w-6 h-6" />
                )}
              </div>

              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3 pr-8">
                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.category === 'S' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.category === 'S' ? 'Sintética' : 'Analítica'}
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">
                      {item.code}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors" title={item.name}>
                  {item.name}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-4" title={item.description}>
                  {item.description}
                </p>
              </div>
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 group-hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    <span>Clique para detalhes</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
        
        {visibleResults.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum resultado encontrado</h3>
            <p className="mt-1 text-sm text-slate-500">Tente alterar os filtros ou use o Assistente IA.</p>
          </div>
        )}
      </div>

      {visibleCount < totalResults && (
        <div ref={loaderRef} className="py-8 flex justify-center w-full">
          <div className="animate-pulse flex space-x-2 items-center text-slate-400 text-sm">
            <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
            <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
            <span>Carregando mais...</span>
          </div>
        </div>
      )}

      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedExpense(null)}
          ></div>
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="w-full pr-8">
                <div className="flex gap-2 mb-2">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedExpense.category === 'S' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedExpense.category === 'S' ? 'Sintética' : 'Analítica'}
                  </span>
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center">
                    {selectedExpense.code}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedExpense.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors absolute right-4 top-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <ClassificationItem 
                    label="C.E." 
                    value={selectedExpense.ce} 
                    name={getCategoriaDescription(selectedExpense.ce)} 
                    tooltip={`Categoria Econômica: ${getCategoriaDescription(selectedExpense.ce)}`} 
                 />
                 <ClassificationItem 
                    label="G.N." 
                    value={selectedExpense.g} 
                    name={getGrupoDescription(selectedExpense.ce, selectedExpense.g)}
                    tooltip={`Grupo de Natureza: ${getGrupoDescription(selectedExpense.ce, selectedExpense.g)}`} 
                 />
                 <ClassificationItem 
                    label="Mod." 
                    value={selectedExpense.m} 
                    name={getModalidadeInfo(selectedExpense.m).name}
                    tooltip={`Modalidade: ${getModalidadeInfo(selectedExpense.m).name} - ${getModalidadeInfo(selectedExpense.m).description}`} 
                 />
                 <ClassificationItem 
                    label="Elem." 
                    value={selectedExpense.e} 
                    name={getElementoDescription(selectedExpense.e)}
                    tooltip={`Elemento: ${getElementoDescription(selectedExpense.e)}`} 
                 />
                 <ClassificationItem 
                    label="Desd." 
                    value={selectedExpense.d} 
                    name="Item Específico"
                    tooltip="Desdobramento (Especificação do item)" 
                 />
              </div>

              <div className="prose prose-slate max-w-none">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Descrição</h4>
                <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap text-justify">
                  {selectedExpense.description}
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-blue-900">Dica do Especialista</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Esta classificação é baseada no Manual de Natureza de Despesa 2025. 
                      {selectedExpense.category === 'S' 
                        ? " Por ser uma conta sintética, não deve ser usada diretamente para empenho. Procure uma conta analítica filha." 
                        : " Certifique-se de que o objeto da despesa corresponde exatamente à descrição acima."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-2">
               <button
                onClick={(e) => {
                    toggleSelection(selectedExpense.code, e as any);
                    setSelectedExpense(null);
                }}
                className={`px-4 py-2 border text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
                    selectedItems.has(selectedExpense.code)
                    ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {selectedItems.has(selectedExpense.code) ? (
                    <><CheckSquare className="w-4 h-4"/> Selecionado</>
                ) : (
                    <><Square className="w-4 h-4"/> Selecionar para Relatório</>
                )}
              </button>
              <button
                onClick={() => setSelectedExpense(null)}
                className="px-4 py-2 bg-slate-800 border border-transparent text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-8 print:p-0" id="printable-report">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8 border-b pb-4">
                         <div className="flex items-center gap-3">
                            <div className="bg-yellow-500 p-2 rounded-lg print:hidden">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Bras%C3%A3o_rio_grande_do_sul.png?20110806101059" alt="RS" className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Relatório de Classificação de Despesa</h1>
                                <p className="text-slate-500 text-sm">Gestor Público RS - Manual 2026</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Data: {new Date().toLocaleDateString()}</p>
                            <p className="text-sm text-slate-500">Itens: {selectedItems.size}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reportItems.map((item) => (
                            <div key={item.code} className="border-b border-slate-200 pb-4 break-inside-avoid">
                                <div className="flex justify-between items-start mb-2">
                                     <span className="font-mono font-bold text-slate-800 text-lg bg-slate-100 px-2 py-0.5 rounded print:bg-transparent print:p-0 print:text-black">
                                        {item.code}
                                     </span>
                                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                         item.category === 'S' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                     } print:border-slate-400 print:text-black`}>
                                        {item.category === 'S' ? 'Sintética' : 'Analítica'}
                                     </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                                <div className="grid grid-cols-5 gap-4 text-xs text-slate-500 mb-3 font-mono bg-slate-50 p-2 rounded print:bg-transparent print:p-0">
                                     <div className="flex flex-col"><span className="font-bold">C.E.</span> {item.ce} - {getCategoriaDescription(item.ce)}</div>
                                     <div className="flex flex-col"><span className="font-bold">G.N.</span> {item.g} - {getGrupoDescription(item.ce, item.g)}</div>
                                     <div className="flex flex-col"><span className="font-bold">Mod.</span> {item.m} - {getModalidadeInfo(item.m).name}</div>
                                     <div className="flex flex-col"><span className="font-bold">Elem.</span> {item.e} - {getElementoDescription(item.e)}</div>
                                     <div className="flex flex-col"><span className="font-bold">Desd.</span> {item.d}</div>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed text-justify">{item.description}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 print:grid">
                        <div className="text-center">
                            <div className="h-px bg-slate-300 w-2/3 mx-auto mb-2"></div>
                            <p className="text-sm text-slate-500">Assinatura do Responsável</p>
                        </div>
                        <div className="text-center">
                            <div className="h-px bg-slate-300 w-2/3 mx-auto mb-2"></div>
                            <p className="text-sm text-slate-500">Visto da Contabilidade</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-4 flex justify-between items-center print:hidden shadow-lg">
                <div className="text-sm text-slate-300">
                    <Info className="w-4 h-4 inline mr-2" />
                    Use as opções do navegador para salvar como PDF.
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowReport(false)}
                        className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                    >
                        Fechar
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimir / Salvar PDF
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const FilterDropdown = ({ label, icon, value, onChange, options, disabled = false }: {
    label: string,
    icon: React.ReactNode,
    value: string,
    onChange: (value: string) => void,
    options: { value: string, label: string }[],
    disabled?: boolean
}) => (
    <div className="relative">
        <label className="block text-xs text-slate-500 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                disabled={disabled}
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-700">
                <ChevronDown className="h-4 w-4" />
            </div>
        </div>
    </div>
);

const ClassificationItem = ({ label, value, name, tooltip }: { label: string, value: string, name: string, tooltip: string }) => (
    <div className="flex flex-col items-center text-center group relative p-2 rounded hover:bg-white transition-colors" title={tooltip}>
        <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
           {label} <HelpCircle className="w-3 h-3 opacity-50" />
        </span>
        <span className="text-xl font-mono font-bold text-slate-800 leading-none mb-1">{value}</span>
        <span className="text-[10px] text-slate-500 leading-tight font-medium line-clamp-2 h-6 flex items-center justify-center">{name}</span>
    </div>
);

export default ExpenseList;