import { UserAnswers } from '../types';

interface TestResultProps {
  userAnswers: UserAnswers;
  numberOfQuestions: number;
  repeatTest: () => void;
}

function TestResult({
  userAnswers,
  numberOfQuestions,
  repeatTest,
}: TestResultProps) {
  const correctAnswers = Object.values(userAnswers).reduce((acc, value) => {
    return value ? acc + 1 : acc;
  }, 0);
  return (
    <div>
      <ul>
        <li>
          Процент правильных ответов:{' '}
          {(correctAnswers / numberOfQuestions) * 100}%
        </li>
        <li>Количество правильных ответов: {correctAnswers}</li>
        <li>
          Количество неправильных ответов: {numberOfQuestions - correctAnswers}
        </li>
      </ul>
      <button type="button" onClick={repeatTest}>
        Начать заново
      </button>
    </div>
  );
}

export default TestResult;
