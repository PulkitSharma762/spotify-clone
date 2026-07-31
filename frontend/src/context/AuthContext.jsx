import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  getCurrentUser,
} from "../api/authApi";

import { toggleFavourite } from "../api/musicApi";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    await loginApi(credentials);
    await loadUser();
  };

  const register = async (userData) => {
    await registerApi(userData);
    await loadUser();
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  };

  const isFavourite = (songId) => {
    if (!user?.favourites) return false;

    return user.favourites.some(
      (song) => song._id === songId || song === songId
    );
  };

  const toggleFavouriteSong = async (song) => {
    if (!user) return;

    const songId =
      typeof song === "string" ? song : song._id;

    try {
      const response = await toggleFavourite(songId);

      setUser((prev) => ({
        ...prev,
        favourites: response.data.favourites,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser,
        isFavourite,
        toggleFavouriteSong,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;