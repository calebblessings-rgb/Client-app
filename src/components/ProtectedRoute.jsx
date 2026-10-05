import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;
