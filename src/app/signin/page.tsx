"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await login(email, password);

    if (error) {
      setError(error.message);
    } else {
      console.log("Logged in as:", data.user?.email);
      window.location.href = "/buyers";
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 text-lg focus:outline-none";

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-400 to-orange-300 p-10 flex-col justify-center text-white items-center ">
        <h1 className="text-4xl -mt-40  font-bold mb-6">Welcome Back!</h1>
        <p className="text-lg  w-100">
          Manage your buyer leads efficiently and never miss an opportunity. Our system helps you
          track, organize, and communicate with leads seamlessly.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-black">Sign In</h2>

          {error && (
            <p className="text-red-700 bg-red-100 p-3 rounded mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="w-80 bg-black hover:bg-gray-400 text-white font-bold py-4 rounded-xl mt-4 text-lg transition-all"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
