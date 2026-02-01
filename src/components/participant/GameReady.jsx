import { Logo, LoadingSpinner } from '../common';

export function GameReady() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="large" className="mb-8" />

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gold mb-4">
          All Set!
        </h1>
        <p className="text-white/80 text-lg mb-8">
          Please wait for the question...
        </p>
        <LoadingSpinner size="large" />
      </div>
    </div>
  );
}
