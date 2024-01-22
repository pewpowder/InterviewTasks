import { useCallback, useEffect, useRef, useState } from 'react';
import type { Time } from './types';
import { convertTimeInSeconds } from './helpers';

export function useTimer(time: Time): [number, boolean, () => void] {
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerId = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    setTimeInSeconds(convertTimeInSeconds(time));
  }, [time]);

  const startTimer = () => {
    timerId.current = setInterval(() => {
      setTimeInSeconds((prevTimeInSeconds) => prevTimeInSeconds - 1);
    }, 1000);
  };

  const stopTimer = () => {
    timerId.current && clearInterval(timerId.current);
    setTimeInSeconds(0);
  };

  const toggleTimer = useCallback(() => {
    isTimerRunning ? stopTimer() : startTimer();
    setIsTimerRunning(!isTimerRunning);
  }, [isTimerRunning]);

  return [timeInSeconds, isTimerRunning, toggleTimer];
}
