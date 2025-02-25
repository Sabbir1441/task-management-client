import { Navigate, useLocation } from 'react-router';
import useAuth from './../hooks/useAuth';
import Spinner from '../components/Spinner';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to='/login' state={{ from: loc }} />;
  return <div>{children}</div>;
};

export default PrivateRoute;