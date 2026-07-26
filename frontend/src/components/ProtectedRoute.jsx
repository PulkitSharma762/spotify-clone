import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin" />

        <p className="text-zinc-400 text-sm">
          Loading Spotify Clone...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;