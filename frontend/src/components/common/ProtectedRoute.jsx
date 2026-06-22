import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" />
    );
  }

  // User not loaded yet
  if (!user) {
    return null;
  }

  // Role check
  if (
    allowedRoles &&
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <Navigate to="/access-denied" />
    );
  }

  return children;
};

export default ProtectedRoute;