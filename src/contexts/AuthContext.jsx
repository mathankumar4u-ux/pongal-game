import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Check if admin session exists
    return sessionStorage.getItem('isAdmin') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist admin state
  useEffect(() => {
    if (isAdmin) {
      sessionStorage.setItem('isAdmin', 'true');
    } else {
      sessionStorage.removeItem('isAdmin');
    }
  }, [isAdmin]);

  // Simple password-based admin authentication
  const loginAdmin = async (password) => {
    setLoading(true);
    setError(null);

    try {
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!adminPassword) {
        throw new Error('Admin password not configured');
      }

      if (password === adminPassword) {
        setIsAdmin(true);
        return true;
      } else {
        setError('Invalid password');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{
      isAdmin,
      loginAdmin,
      logoutAdmin,
      loading,
      error,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
