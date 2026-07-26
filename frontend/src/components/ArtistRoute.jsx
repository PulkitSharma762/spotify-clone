import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ArtistRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto" />

          <p className="text-zinc-400 mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "artist") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ArtistRoute;