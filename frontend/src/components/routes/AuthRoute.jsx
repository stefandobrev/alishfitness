import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AuthRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />;
};
