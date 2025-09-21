export type Question = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};


export type Quiz = {
  id: string;
  title: string;
  description: string;
  moduleId: string; 
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  questions: Question[];
};