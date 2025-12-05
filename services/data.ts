import { ExpenseEntry } from '../types';

const SHEET_ID = '1Q8PWtx8CCccoaoLE1lERqYv4gtazFTZTrhbG_t4iBeg';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Fallback data in case fetch fails (Sample)
const FALLBACK_DATA: ExpenseEntry[] = [
  {
    code: "3.3.90.30.00.00.00.00",
    category: "S",
    name: "MATERIAL DE CONSUMO",
    description: "Despesas orçamentárias com material de consumo conforme definido no anexo 'II - Natureza da Despesa'.",
    ce: "3",
    g: "3",
    m: "90",
    e: "30",
    d: "000000"
  }
];

export async function fetchExpenses(): Promise<ExpenseEntry[]> {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    return parseCSV(csvText);
    
  } catch (error) {
    console.error("Error loading expense data:", error);
    return FALLBACK_DATA;
  }
}

function parseCSV(csvText: string): ExpenseEntry[] {
  const lines = csvText.split(/\r?\n/);
  const entries: ExpenseEntry[] = [];
  
  let startIndex = 1;
  // Find the actual header row
  for(let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('CE,G,M,E,D,D,D,D')) {
      startIndex = i + 1;
      break;
    }
  }


  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => {
        return col.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
    });

    if (columns.length < 12) continue;
    if (!/^\d/.test(columns[0])) continue; // Skip lines that don't start with a number in the first column

    entries.push({
      ce: columns[0],
      g: columns[1],
      m: columns[2],
      e: columns[3],
      d: `${columns[4]}${columns[5]}${columns[6]}${columns[7]}`,
      code: columns[8],
      category: columns[9],
      name: columns[10],
      description: columns[11]
    });
  }
  return entries;
}

export const searchExpenses = (
  data: ExpenseEntry[], 
  term: string, 
  filterType: 'all' | 'code' | 'name' | 'description' = 'all',
  categoryFilter: 'all' | 'S' | 'A' = 'all',
  filterCE: string = 'all',
  filterG: string = 'all',
  filterM: string = 'all',
  filterE: string = 'all'
): ExpenseEntry[] => {
  const lowerTerm = term.toLowerCase();
  
  return data.filter(entry => {
    // 1. Category Filter (Sintética/Analítica)
    if (categoryFilter !== 'all' && entry.category !== categoryFilter) {
      return false;
    }

    // 2. Economic Category Filter (CE)
    if (filterCE !== 'all') {
        if (filterCE === 'reservas') {
            if (entry.ce !== '7' && entry.ce !== '9') return false;
        } else {
            if (entry.ce !== filterCE) return false;
        }
    }
    
    // 3. Group of Nature Filter (G)
    if (filterG !== 'all' && entry.g !== filterG) {
        return false;
    }

    // 4. Modality of Application Filter (M)
    if (filterM !== 'all' && entry.m !== filterM) {
      return false;
    }

    // 5. Element of Expense Filter (E)
    if (filterE !== 'all' && entry.e !== filterE) {
      return false;
    }

    // 6. Search Term Filter
    if (!term) return true;

    switch (filterType) {
      case 'code':
        return entry.code.includes(lowerTerm);
      case 'name':
        return entry.name.toLowerCase().includes(lowerTerm);
      case 'description':
        return entry.description.toLowerCase().includes(lowerTerm);
      default:
        return (
          entry.code.includes(lowerTerm) ||
          entry.name.toLowerCase().includes(lowerTerm) ||
          entry.description.toLowerCase().includes(lowerTerm)
        );
    }
  });
};

export const getExpenseContext = (data: ExpenseEntry[]): string => {
  return data.map(e => 
    `[${e.code}] (${e.category}) ${e.name}: ${e.description}`
  ).join('\n');
};