import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export function Timer({
  duration = 20,
  onTimeout,
  startTime,
  isPaused = false
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!startTime) return duration;
    const startMs = startTime.toMillis ? startTime.toMillis() : startTime;
    const elapsed = Math.floor((Date.now() - startMs) / 1000);
    return Math.max(0, duration - elapsed);
  }, [duration, startTime]);

  useEffect(() => {
    if (isPaused) return;

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      setIsWarning(remaining <= 5);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeout?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [duration, startTime, onTimeout, isPaused, calculateTimeLeft]);

  const percentage = (timeLeft / duration) * 100;
  const circumference = 2 * Math.PI * 36;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Circular timer display */}
      <div className={clsx(
        "relative w-24 h-24",
        isWarning && "animate-pulse"
      )}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-white/20"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percentage / 100)}
            className={clsx(
              "transition-all duration-100",
              isWarning ? "text-red-500" : "text-gold"
            )}
            strokeLinecap="round"
          />
        </svg>
        {/* Time display */}
        <span className={clsx(
          "absolute inset-0 flex items-center justify-center text-3xl font-bold",
          isWarning ? "text-red-500" : "text-white"
        )}>
          {timeLeft}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full transition-all duration-100 rounded-full",
            isWarning ? "bg-red-500" : "bg-gold"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Warning text */}
      {isWarning && (
        <p className="mt-2 text-red-400 text-sm font-medium animate-pulse">
          Hurry up!
        </p>
      )}
    </div>
  );
}
