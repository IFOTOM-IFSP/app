import {
  getAllQuizResults as dbGetAllQuizResults,
  saveQuizResult as dbSaveQuizResult,
  type QuizResult
} from '@/storage/quizResultsStorage';
import { create } from 'zustand';

type HighScores = {
  [quizId: string]: number;
};

interface QuizState {
  isLoading: boolean;
  results: QuizResult[];
  highScores: HighScores;
  actions: {
    addQuizResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;
    refreshResults: () => Promise<void>;
  };
}

export const useQuizStore = create<QuizState>((set, get) => ({
  isLoading: true,
  results: [],
  highScores: {},
  
  actions: {
    refreshResults: async () => {
      if (!get().isLoading) {
        set({ isLoading: true });
      }
      try {
        const allResults = await dbGetAllQuizResults();
        const scores: HighScores = {};

        for (const result of allResults) {
          if (!scores[result.quizId] || result.score > scores[result.quizId]) {
            scores[result.quizId] = result.score;
          }
        }

        set({ results: allResults, highScores: scores, isLoading: false });
      } catch (error) {
        console.error("quizStore: Erro ao carregar dados do quiz.", error);
        set({ isLoading: false });
      }
    },

    addQuizResult: async (result: Omit<QuizResult, 'id'>) => {
      try {
        await dbSaveQuizResult(result);
        await get().actions.refreshResults(); 
      } catch (error) {
        console.error("quizStore: Erro ao salvar resultado do quiz.", error);
      }
    },
  },
}));

export const useQuizActions = () => useQuizStore((state) => state.actions);
