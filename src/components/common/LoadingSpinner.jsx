import { clsx } from 'clsx';

export function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          sizes[size],
          'border-4 border-gold/30 border-t-gold rounded-full animate-spin'
        )}
      />
    </div>
  );
}

export function FullPageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-4">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gold text-lg">{message}</p>
    </div>
  );
}
