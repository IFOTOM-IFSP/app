import type { QuizResult } from '@/src/storage/quizResultsStorage';
import {
    useHighScores as useHighScoresSelector,
    useIsQuizLoading as useIsQuizLoadingSelector,
    useQuizActions,
    useQuizResults as useQuizResultsSelector
} from '@/src/store/quizStore';
import { useEffect } from 'react';

interface UseQuizResultsReturn {
  isLoading: boolean;
  results: QuizResult[];
  highScores: { [quizId: string]: number };
  addQuizResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;
  refreshResults: () => Promise<void>;
}

export function useQuizResults(): UseQuizResultsReturn {
  const isLoading = useIsQuizLoadingSelector();
  const results = useQuizResultsSelector();
  const highScores = useHighScoresSelector();
  const { init, addQuizResult } = useQuizActions();

  useEffect(() => {
    init();
  }, [init]);

  return {
    isLoading,
    results,
    highScores,
    addQuizResult,
    refreshResults: init, 
  };
}
