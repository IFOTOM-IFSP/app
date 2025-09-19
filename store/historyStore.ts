import * as storage from '@/storage/storageService';
import { create } from 'zustand';
import { AnalysisReport } from '../models/analysis';

type HistorySummary = Pick<AnalysisReport, 'id' | 'setupData' | 'savedAt'>;

interface HistoryState {
  historyList: HistorySummary[];
  selectedAnalysis: AnalysisReport | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  
  loadHistoryList: () => Promise<void>;
  loadSingleReport: (id: string) => Promise<void>;
  addReportToHistory: (report: AnalysisReport) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  historyList: [],
  selectedAnalysis: null,
  status: 'idle',

  loadHistoryList: async () => {
    set({ status: 'loading' });
    try {
      const list = await storage.getHistoryList();
      set({ historyList: list, status: 'success' });
    } catch (e) {
      set({ status: 'error' });
    }
  },

  loadSingleReport: async (id: string) => {
    set({ status: 'loading', selectedAnalysis: null });
    try {
      const report = await storage.loadAnalysisReport(id);
      set({ selectedAnalysis: report, status: 'success' });
    } catch (e) {
      set({ status: 'error' });
    }
  },

  addReportToHistory: async (report) => {
    // Não precisa mudar o estado, apenas salvar e recarregar a lista da próxima vez
    await storage.saveAnalysisReport(report);
  }
}));