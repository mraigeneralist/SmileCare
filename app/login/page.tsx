"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      router.push("/admin");
    } else {
      alert("Login failed");
    }
  }

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm">

        <h1 className="text-xl font-bold mb-4">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 rounded"
        >
          Login
        </button>

      </div>
    </main>
  );
}