import { useRef, useState } from 'react';
import data from './questions.json';
import type { Question, UserAnswers } from './types';
import styles from './FirstTask.module.css';
import TestResult from './components/TestResult';

function FirstTaskPage() {
  const questions = useRef<Question[]>(data);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);

  const handleNextClick = () => {
    setCurrentQuestionNumber(currentQuestionNumber + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentQuestion = questions.current[currentQuestionNumber];
    const index = Number(e.currentTarget.value);

    setUserAnswers((prevAnswers) => {
      return {
        ...prevAnswers,
        [currentQuestionNumber]: currentQuestion.answers[index].isCorrect,
      };
    });
  };

  const repeatTest = () => {
    setUserAnswers({});
    setCurrentQuestionNumber(0);
  };

  if (currentQuestionNumber === questions.current.length) {
    return (
      <TestResult
        userAnswers={userAnswers}
        numberOfQuestions={questions.current.length}
        repeatTest={repeatTest}
      />
    );
  }

  const isNextButtonDisabled =
    Object.keys(userAnswers).length - 1 !== currentQuestionNumber;
  return (
    <div>
      <h2>
        Вопрос {currentQuestionNumber + 1} из {questions.current.length}
      </h2>
      <h3>{questions.current[currentQuestionNumber].question}</h3>
      <div className={styles['question']} key={currentQuestionNumber}>
        {questions.current[currentQuestionNumber].answers.map((answer, i) => {
          return (
            <label key={i}>
              <input
                type="radio"
                name="answer"
                value={i}
                onChange={handleInputChange}
              />
              {answer.text}
            </label>
          );
        })}
        <button disabled={isNextButtonDisabled} onClick={handleNextClick}>
          {currentQuestionNumber >= questions.current.length
            ? 'Закончить и показатель результаты'
            : 'Далее'}
        </button>
      </div>
    </div>
  );
}

export default FirstTaskPage;
