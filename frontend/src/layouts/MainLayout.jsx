import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Player from "../components/Player";

const MainLayout = () => {
  return (
    <div className="h-dvh bg-black text-white flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0 gap-2 p-2 pb-0">
        <Sidebar />

        <main className="flex-1 min-w-0 flex flex-col bg-linear-to-b from-zinc-900 to-zinc-950 rounded-lg overflow-hidden">
          <Navbar />

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
};

export default MainLayout;