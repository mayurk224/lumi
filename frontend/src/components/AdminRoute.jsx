// Protects routes that require admin role

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser, selectIsAdmin } from "../redux/authSlice";

const AdminRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
