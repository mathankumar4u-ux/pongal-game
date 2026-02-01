import { Link } from 'react-router-dom';
import { Logo, Button } from '../components/common';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="large" className="mb-8" />

      <h1 className="text-4xl font-bold text-gold mb-4">404</h1>
      <p className="text-white/80 text-lg mb-8">Page not found</p>

      <Link to="/">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
