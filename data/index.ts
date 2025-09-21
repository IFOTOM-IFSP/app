import { Module } from '@/src/models/contentSchema';
import { Quiz } from '@/src/models/quizSchema';
import { fifthModule } from './modulesDatas/FifthModule';
import { firstModule } from './modulesDatas/FirstModule';
import { fourthModule } from './modulesDatas/FourthModule';
import { secondModule } from './modulesDatas/SecondModule';
import { seventhModule } from './modulesDatas/SeventhModule';
import { sixthModule } from './modulesDatas/SixthModule';
import { thirdModule } from './modulesDatas/ThirdModule';
import { quizFifthModule } from './quizData/QuizFifthModule';
import { quizFourthModule } from './quizData/QuizFourthModule';
import { quizOneModule } from './quizData/QuizOneModule';
import { quizSecondModule } from './quizData/QuizSecondModule';
import { quizSeventhModule } from './quizData/QuizSeventhModule';
import { quizSixthModule } from './quizData/QuizSixthModule';
import { quizThirdModule } from './quizData/QuizThirdModule';

export const MODULES_DATA: Module[] = [
  firstModule,
  secondModule,
  thirdModule,
  fourthModule,
  fifthModule,
  sixthModule,
  seventhModule
];

export const quizData: Quiz[] = [
  ...quizOneModule,
  ...quizSecondModule,
  ...quizThirdModule,
  ...quizFourthModule,
  ...quizFifthModule,
  ...quizSixthModule,
  ...quizSeventhModule
];

export * from './aboutScreenData';
export * from './articleData';
export * from './educationData';
export * from './glossaryData';
export * from './referencesData';

