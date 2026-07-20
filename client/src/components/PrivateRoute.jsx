import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
