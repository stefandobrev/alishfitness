import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MemberRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  return isAuthenticated && !isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={'/my-program'} />
  );
};
export default MemberRoute;
