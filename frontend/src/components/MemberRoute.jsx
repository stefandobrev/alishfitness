import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MemberRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return isAuthenticated && !isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={'/training-program/view-all'} />
  );
};
export default MemberRoute;
