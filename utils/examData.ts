import examData from '../examData.json';

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export const questions: Question[] = examData.questions;

export const getTotalQuestions = (): number => questions.length;

