import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const MemberRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return isAuthenticated && !isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={'/my-program'} />
  );
};
