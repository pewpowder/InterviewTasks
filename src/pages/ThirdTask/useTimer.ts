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

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const end = new Date(new Date().getTime() + timeInSeconds * 1000);

    timerId.current = setInterval(() => {
      const now = new Date();
      const restTime = Math.round((end.getTime() - now.getTime()) / 1000);
      setTimeInSeconds(restTime);
    }, 1000);

    return clearTimer;
  }, [isTimerRunning, timeInSeconds]);

  const clearTimer = () => {
    timerId.current && clearInterval(timerId.current);
  };

  const toggleTimer = () => {
    isTimerRunning && clearTimer();
    setIsTimerRunning(!isTimerRunning)
  };

  return [timeInSeconds, isTimerRunning, toggleTimer];
}
