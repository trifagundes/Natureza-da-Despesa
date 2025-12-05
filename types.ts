export interface ExpenseEntry {
  code: string;
  category: string; // 'S' (Sintética) or 'A' (Analítica)
  name: string;
  description: string;
  // Detailed classification
  ce: string; // Categoria Econômica
  g: string;  // Grupo de Natureza
  m: string;  // Modalidade de Aplicação
  e: string;  // Elemento de Despesa
  d: string;  // Desdobramento (combined D columns)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}