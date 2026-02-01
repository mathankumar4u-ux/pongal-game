import { useAuth } from '../contexts/AuthContext';
import { AdminLogin, AdminDashboard } from '../components/admin';

export function AdminPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
