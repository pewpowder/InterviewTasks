export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export interface UserAnswers {
  [key: number]: boolean,
};
