import type { Time } from './types';

export function convertSecondToDisplayedTime(seconds: number) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');

  return hours + ':' + minutes + ':' + remainingSeconds;
}

export function convertTimeInSeconds(time: Time) {
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}
