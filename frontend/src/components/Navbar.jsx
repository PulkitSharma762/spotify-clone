import {
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const mobileNavClass = ({ isActive }) =>
    `md:hidden w-9 h-9 rounded-full items-center justify-center ${
      isActive
        ? "bg-white text-black"
        : "bg-black text-zinc-300"
    }`;

  return (
    <header className="h-16 shrink-0 flex justify-between items-center px-4 sm:px-6 bg-zinc-950/90">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className="hidden sm:flex w-9 h-9 bg-black rounded-full items-center justify-center text-zinc-300 hover:text-white transition"
        >
          <FaChevronRight />
        </button>

        <NavLink
          to="/home"
          aria-label="Home"
          className={mobileNavClass}
        >
          <FaHome />
        </NavLink>

        <NavLink
          to="/search"
          aria-label="Search"
          className={mobileNavClass}
        >
          <FaSearch />
        </NavLink>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-black rounded-full pl-1 pr-4 py-1">
          <div className="w-8 h-8 rounded-full bg-green-500 text-black font-bold flex items-center justify-center uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>

          <span className="font-semibold text-sm max-w-32 truncate">
            {user?.username || "User"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="w-9 h-9 rounded-full bg-black hover:bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Navbar;