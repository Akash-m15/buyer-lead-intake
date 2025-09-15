"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const {data,error} = await login(email, password);

    if (error) {
      setError(error.message);
    } else {
      console.log("Logged in as:", data.user?.email);
      window.location.href = "/buyers";
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
      {error && <p className="text-red-400">{error}</p>}
    </form>
  );
}
