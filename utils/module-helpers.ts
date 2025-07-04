import { MODULES_DATA } from '@/data/modulesData';
import { Module, ModulePage } from '@/schema/contentSchema';

export const moduleTitles: { [key: string]: string } = {
  "1": "Introdução",
  "2": "Luz e Matéria",
  "3": "Lei de Beer-Lambert",
  "4": "Instrumentação",
  "5": "Tipos de Análise",
  "6": "Preparo de Soluções",
  "7": "Interpretação",
};

const modulesMap: Map<string, Module> = new Map(
  MODULES_DATA.map(module => [module.id, module])
);

const pageIndexMap: Map<string, number> = new Map();
MODULES_DATA.forEach(module => {
  module.pages.forEach((page, index) => {
    pageIndexMap.set(`${module.id}-${page.id}`, index);
  });
});



export function getModuleById(moduleId?: string): Module | undefined {
  if (!moduleId) return undefined;
  return modulesMap.get(moduleId);
}

export function getModuleTitleById(moduleId?: string): string {
  const module = getModuleById(moduleId);
  return module ? module.title : 'Módulo Desconhecido';
}

export function getModulePageById(moduleId?: string, pageId?: string): ModulePage | undefined {
  if (!pageId) return undefined;
  const module = getModuleById(moduleId);
  return module?.pages.find(p => p.id === pageId);
}

export const getNextPage = (moduleId: string, currentPageId: string): ModulePage | null => {
  const module = getModuleById(moduleId);
  if (!module) return null;

  const currentPageIndex = pageIndexMap.get(`${moduleId}-${currentPageId}`);

  if (currentPageIndex === undefined || currentPageIndex >= module.pages.length - 1) {
    return null;
  }

  return module.pages[currentPageIndex + 1];
};

export const getPreviousPage = (moduleId: string, currentPageId: string): ModulePage | null => {
  const module = getModuleById(moduleId);
  if (!module) return null;
  
  const currentPageIndex = pageIndexMap.get(`${moduleId}-${currentPageId}`);

  if (currentPageIndex === undefined || currentPageIndex <= 0) {
    return null;
  }

  return module.pages[currentPageIndex - 1];
};