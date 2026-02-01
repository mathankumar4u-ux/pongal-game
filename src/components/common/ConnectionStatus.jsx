import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={clsx(
      "fixed top-0 left-0 right-0 z-50",
      "py-2 px-4 text-center text-sm font-medium",
      "bg-red-500 text-white",
      "animate-pulse"
    )}>
      You are offline. Please check your connection.
    </div>
  );
}
