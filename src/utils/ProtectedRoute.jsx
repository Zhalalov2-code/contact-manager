import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../css/protectedRoute.css"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
