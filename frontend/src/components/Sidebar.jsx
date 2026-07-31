import {
  FaCompactDisc,
  FaHeart,
  FaHome,
  FaSearch,
  FaTools,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-md font-semibold transition ${
      isActive
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:text-white"
    }`;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col gap-2">
      <div className="bg-zinc-950 rounded-lg px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-950/30">
            <FaCompactDisc className="text-black text-xl" />
          </div>

          <h1 className="text-xl font-bold tracking-tight">
            Spotify Clone
          </h1>
        </div>
      </div>

      <nav className="bg-zinc-950 rounded-lg p-2">
        <NavLink to="/home" className={navClass}>
          <FaHome className="text-xl" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className={navClass}>
          <FaSearch className="text-xl" />
          <span>Search</span>
        </NavLink>

        <NavLink to="/liked" className={navClass}>
          <FaHeart className="text-xl text-green-500" />
          <span>Liked Songs</span>
        </NavLink>

        {user?.role === "artist" && (
          <NavLink to="/admin" className={navClass}>
            <FaTools className="text-xl" />
            <span>Content Manager</span>
          </NavLink>
        )}
      </nav>

      <div className="flex-1 bg-zinc-950 rounded-lg p-5">
        <div className="flex items-center gap-3 text-zinc-300 font-semibold">
          <FaCompactDisc />
          <span>Your Library</span>
        </div>

        <p className="text-xs leading-5 text-zinc-500 mt-4">
          Browse your music collection, albums and
          artists.
        </p>

        <div className="mt-6 border-t border-zinc-800 pt-5">
          <p className="text-xs uppercase tracking-widest font-bold text-green-500">
            Liked Songs
          </p>

          <p className="text-xs leading-5 text-zinc-500 mt-2">
            All the songs you've marked as favourites
            will appear here.
          </p>
        </div>

        {user?.role === "artist" && (
          <div className="mt-6 border-t border-zinc-800 pt-5">
            <p className="text-xs uppercase tracking-widest font-bold text-green-500">
              Artist account
            </p>

            <p className="text-xs leading-5 text-zinc-500 mt-2">
              Upload songs and create collections from
              Content Manager.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;