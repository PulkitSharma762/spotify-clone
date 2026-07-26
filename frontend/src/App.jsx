import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ArtistRoute from "./components/ArtistRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Admin from "./pages/Admin";
import Album from "./pages/Album";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/album/:id" element={<Album />} />

            <Route element={<ArtistRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
              <div className="text-center">
                <h1 className="text-7xl font-black">
                  404
                </h1>

                <p className="text-zinc-400 mt-3">
                  Page not found
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;