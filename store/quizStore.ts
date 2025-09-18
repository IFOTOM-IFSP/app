import { handleError } from '@/services/errorHandler';
import {
    getAllQuizResults as dbGetAllQuizResults,
    saveQuizResult as dbSaveQuizResult,
    type QuizResult,
} from '@/src/native/storage/quizResultsStorage';
import { create } from 'zustand';

type HighScores = {
  [quizId: string]: number;
};

interface QuizState {
  isLoading: boolean;
  results: QuizResult[];
  highScores: HighScores;
}

interface QuizActions {
  init: () => Promise<void>;
  addQuizResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;
}

const calculateHighScores = (results: QuizResult[]): HighScores => {
  return results.reduce((scores, result) => {
    if (!scores[result.quizId] || result.score > scores[result.quizId]) {
      scores[result.quizId] = result.score;
    }
    return scores;
  }, {} as HighScores);
};


export const useQuizStore = create<QuizState & { actions: QuizActions }>(
  (set, get) => ({
    isLoading: true,
    results: [],
    highScores: {},

    actions: {
      init: async () => {
        if (!get().isLoading) {
          set({ isLoading: true });
        }
        try {
          const allResults = await dbGetAllQuizResults();
          const highScores = calculateHighScores(allResults);
          set({ results: allResults, highScores, isLoading: false });
        } catch (error) {
          handleError(error, 'quizStore:init');
          set({ isLoading: false });
        }
      },

      addQuizResult: async (newResultData: Omit<QuizResult, 'id'>) => {
        try {
          const savedResult = await dbSaveQuizResult(newResultData);

          set((state) => {
            const updatedResults = [...state.results, savedResult];
            const updatedHighScores = calculateHighScores(updatedResults);
            return {
              results: updatedResults,
              highScores: updatedHighScores,
            };
          });
        } catch (error) {
          handleError(error, 'quizStore:addQuizResult', { newResultData });
          throw error;
        }
      },
    },
  })
);


export const useQuizActions = () => useQuizStore((state) => state.actions);
export const useQuizResults = () => useQuizStore((state) => state.results);
export const useHighScores = () => useQuizStore((state) => state.highScores);
export const useIsQuizLoading = () => useQuizStore((state) => state.isLoading);


export const initializeQuizStore = (): void => {
  useQuizStore.getState().actions.init();
};
