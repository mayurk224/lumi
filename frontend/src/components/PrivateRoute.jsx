// Protects routes that require authentication

import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectUser, selectIsInitialized } from "../redux/authSlice";

const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-100">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
