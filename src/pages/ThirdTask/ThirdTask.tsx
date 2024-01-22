import React, { useEffect, useState } from 'react';
import type { Time } from './types';
import styles from './ThirdTask.module.css';
import { useTimer } from './useTimer';
import { convertSecondToDisplayedTime } from './helpers';

export default function ThirdTaskPage() {
  const [time, setTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeInSeconds, isTimerRunning, toggleTimer] = useTimer(time);

  useEffect(() => {
    if (isTimerRunning && timeInSeconds === 0) {
      alert('Время истекло');
      toggleTimer();
      resetTime();
    }
  }, [isTimerRunning, timeInSeconds, toggleTimer]);

  const resetTime = () => {
    setTime({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = Number(e.currentTarget.value);

    if (value < 0) {
      alert('Значение времени не может быть меньше нуля');
      return;
    }

    if ((name === 'seconds' || name === 'minutes') && value > 60) {
      alert('Значение секунд или минут не может быть больше 60');
      return;
    }

    setTime({ ...time, [name]: Number(value) });
  };

  const handleButtonClick = () => {
    if (isTimerRunning) {
      resetTime();
    }
    toggleTimer();
  };

  return (
    <div>
      <h1>{convertSecondToDisplayedTime(timeInSeconds)}</h1>
      <div className={styles['timer']}>
        <label>
          Часы
          <input
            type="number"
            name="hours"
            min={0}
            disabled={isTimerRunning}
            value={time.hours.toString()}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Минуты
          <input
            type="number"
            name="minutes"
            min={0}
            max={60}
            disabled={isTimerRunning}
            value={time.minutes.toString()}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Секунды
          <input
            type="number"
            name="seconds"
            min={0}
            max={60}
            disabled={isTimerRunning}
            value={time.seconds.toString()}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleButtonClick}>
          {isTimerRunning ? 'Остановить' : 'Запустить'}
        </button>
      </div>
    </div>
  );
}
