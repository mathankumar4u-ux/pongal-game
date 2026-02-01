import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Logo } from '../common';

export function AdminLogin() {
  const { loginAdmin, loading, error, setError } = useAuth();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }
    await loginAdmin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="large" className="mb-8" />

      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold text-maroon text-center mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/50 outline-none transition-colors text-gray-900 bg-white"
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </form>
      </div>

      <p className="mt-6 text-white/60 text-sm">
        Admin access only
      </p>
    </div>
  );
}
