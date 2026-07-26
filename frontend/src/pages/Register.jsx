import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/home");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create your account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 sm:p-10 shadow-2xl flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold">
            Spotify Clone
          </h1>

          <p className="text-zinc-400 mt-2">
            Create your account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold mb-2"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={30}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3.5 outline-none focus:border-green-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-2"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            autoComplete="email"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3.5 outline-none focus:border-green-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
            minLength={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3.5 outline-none focus:border-green-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-black py-3.5 rounded-full font-bold transition"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-zinc-400 text-sm">
          Already have an account?
          <Link
            to="/login"
            className="text-white font-semibold ml-2 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;