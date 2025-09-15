"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      setError("Email already registered. Redirecting to sign-in...");
      router.push("/signin");
    } else {
      alert("Check your email for confirmation link");
      router.push("/signin");
    }
  };

  const inputClass =
    "w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-gray-600";

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 items-center justify-center relative p-10">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-extrabold text-black mb-6">
            Welcome 
          </h1>
          <p className="text-gray-800 italic text-lg mb-4">
            "Manage your buyer leads efficiently and effortlessly. Our system helps you track, organize, and convert leads into happy homeowners."
          </p>
          <p className="text-gray-700 text-base">
            Sign up to get started.
          </p>
          {/* Optional decorative background element */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50%" cy="50%" r="200" fill="#FFD700" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
            Sign Up
          </h2>

          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />

            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition-colors mb-4 text-lg"
            >
              Sign Up
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-black font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
