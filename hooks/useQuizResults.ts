

import {
  getAllQuizResults as dbGetAllQuizResults,
  saveQuizResult as dbSaveQuizResult,
  type QuizResult
} from '@/storage/quizResultsStorage';
import { useCallback, useState } from 'react';

type HighScores = {
  [quizId: string]: number;
};


interface UseQuizResultsReturn {

  isLoading: boolean;

  results: QuizResult[];

  highScores: HighScores;

  addQuizResult: (result: Omit<QuizResult, 'id'>) => Promise<void>;

  refreshResults: () => Promise<void>;
}


export function useQuizResults(): UseQuizResultsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [highScores, setHighScores] = useState<HighScores>({});


  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const allResults = await dbGetAllQuizResults();
      const scores: HighScores = {};


      for (const result of allResults) {
        if (!scores[result.quizId] || result.score > scores[result.quizId]) {
          scores[result.quizId] = result.score;
        }
      }

      setResults(allResults);
      setHighScores(scores);
    } catch (error) {
      console.error("useQuizResults: Erro ao carregar dados do quiz.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const addQuizResult = useCallback(
    async (result: Omit<QuizResult, 'id'>) => {
      try {
        await dbSaveQuizResult(result);
        await loadData();
      } catch (error) {
        console.error("useQuizResults: Erro ao salvar resultado do quiz.", error);
      }
    },
    [loadData]
  );

  const refreshResults = useCallback(async () => {
    await loadData();
  }, [loadData]);


  return {
    isLoading,
    results,
    highScores,
    addQuizResult,
    refreshResults,
  };
}
