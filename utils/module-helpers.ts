import { MODULES_DATA } from '@/constants/modulesData';
import { Module, ModulePage } from '@/interfaces/content';


export function getModuleById(moduleId?: string): Module | undefined {
  if (!moduleId) {
    return undefined;
  }
  return MODULES_DATA.find(module => module.id === moduleId);
}

export function getModuleTitleById(moduleId?: string): string {
  if (!moduleId) {
    return "Módulo";
  }
  const module = getModuleById(moduleId);
  return module ? module.title : 'Módulo Desconhecido';
}

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

export const getNextPage = (moduleId: string, currentPageId: string): ModulePage | null => {
  const module = getModuleById(moduleId);
  if (!module) return null;

  const currentPageIndex = module.pages.findIndex(p => p.id === currentPageId);

  // Se não encontrou a página ou se já é a última
  if (currentPageIndex === -1 || currentPageIndex >= module.pages.length - 1) {
    return null;
  }

  return module.pages[currentPageIndex + 1];
};

// Pega a página ANTERIOR na sequência
export const getPreviousPage = (moduleId: string, currentPageId: string): ModulePage | null => {
  const module = getModuleById(moduleId);
  if (!module) return null;
  
  const currentPageIndex = module.pages.findIndex(p => p.id === currentPageId);


  if (currentPageIndex <= 0) {
    return null;
  }

  return module.pages[currentPageIndex - 1];
};