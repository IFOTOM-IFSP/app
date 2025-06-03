
export interface ModulePage {
  id: string;
  title: string;

  // contentType: 'text' | 'image' | 'video';
  // contentValue: string; // URL para imagem/video ou texto direto
  // interactiveElements?: any[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  iconName?: string; 
  pages: ModulePage[];

  // estimatedTime: string;
  // prerequisites?: string[];
}

// Dados mock dos módulos de aprendizagem
export const MODULES_DATA: Module[] = [
  {
    id: 'introducao-espectro',
    title: 'Introdução à Espectrofotometria',
    description: 'Conceitos básicos, importância e o espectro eletromagnético.',
    pages: [
      { id: '1', title: 'O que é Espectrofotometria?' },
      { id: '2', title: 'O Espectro Eletromagnético' },
      { id: '3', title: 'Luz Visível e Cores' },
    ],
  },
  {
    id: 'lei-de-beer',
    title: 'Lei de Beer-Lambert',
    description: 'Entendendo a relação fundamental entre absorbância e concentração.',
    pages: [
      { id: '1', title: 'A Fórmula Detalhada (A=εbc)' },
      { id: '2', title: 'Significado de cada Variável' },
      { id: '3', title: 'Aplicações e Limitações da Lei' },
      { id: '4', title: 'Exemplo Prático de Cálculo' },
    ],
  },
  {
    id: 'instrumentacao',
    title: 'Instrumentação do Espectrofotômetro',
    description: 'Conheça os componentes chave de um espectrofotômetro.',
    pages: [
      { id: '1', title: 'Fonte de Luz (Lâmpadas)' },
      { id: '2', title: 'Monocromador (Prismas e Grades de Difração)' },
      { id: '3', title: 'Porta-Amostras e Cubetas' },
      { id: '4', title: 'Detector (Fotodiodos, PMTs)' },
      { id: '5', title: 'Sistema de Leitura e Display' },
    ],
  },

];

/**
 * Busca um módulo específico pelo seu ID.
 * @param moduleId O ID do módulo a ser encontrado.
 * @returns O objeto do módulo se encontrado, caso contrário, undefined.
 */
export function getModuleById(moduleId?: string): Module | undefined {
  if (!moduleId) {
    return undefined;
  }
  return MODULES_DATA.find(module => module.id === moduleId);
}

/**
 * Retorna o título de um módulo específico pelo seu ID.
 * Útil para definir títulos de header dinamicamente.
 * @param moduleId O ID do módulo.
 * @returns O título do módulo ou uma string padrão se não encontrado.
 */
export function getModuleTitleById(moduleId?: string): string {
  if (!moduleId) {
    return "Módulo";
  }
  const module = getModuleById(moduleId);
  return module ? module.title : 'Módulo Desconhecido';
}

/**
 * Busca uma página específica dentro de um módulo pelo ID do módulo e ID da página.
 * @param moduleId O ID do módulo pai.
 * @param pageId O ID da página a ser encontrada.
 * @returns O objeto da página se encontrada, caso contrário, undefined.
 */
export function getModulePageById(moduleId?: string, pageId?: string): ModulePage | undefined {
  if (!moduleId || !pageId) {
    return undefined;
  }
  const module = getModuleById(moduleId);
  if (!module) {
    return undefined;
  }
  return module.pages.find(p => p.id === pageId);
}

/**
 * Retorna a próxima página de um módulo, se houver.
 * @param moduleId O ID do módulo atual.
 * @param currentPageId O ID da página atual.
 * @returns O objeto da próxima página ou null se não houver próxima página.
 */
export function getNextPage(moduleId?: string, currentPageId?: string): ModulePage | null {
  if (!moduleId || !currentPageId) return null;
  const module = getModuleById(moduleId);
  if (!module) return null;

  const currentPageIndex = module.pages.findIndex(p => p.id === currentPageId);
  if (currentPageIndex === -1 || currentPageIndex >= module.pages.length - 1) {
    return null; // Não encontrou a página atual ou é a última página
  }
  return module.pages[currentPageIndex + 1];
}

/**
 * Retorna a página anterior de um módulo, se houver.
 * @param moduleId O ID do módulo atual.
 * @param currentPageId O ID da página atual.
 * @returns O objeto da página anterior ou null se não houver página anterior.
 */
export function getPreviousPage(moduleId?: string, currentPageId?: string): ModulePage | null {
  if (!moduleId || !currentPageId) return null;
  const module = getModuleById(moduleId);
  if (!module) return null;

  const currentPageIndex = module.pages.findIndex(p => p.id === currentPageId);
  if (currentPageIndex <= 0) { // Não encontrou a página atual ou é a primeira página
    return null;
  }
  return module.pages[currentPageIndex - 1];
}