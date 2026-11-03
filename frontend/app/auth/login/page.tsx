"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Abhi frontend demo hai. Backend API yahan connect hogi.
    console.log({
      email,
      password,
      rememberMe,
    });

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fff8f3] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight text-[#8b4513]"
          >
            Cake House
          </Link>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email and password to continue.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#8b4513]/20"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[#8b4513] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-[#8b4513] focus:ring-2 focus:ring-[#8b4513]/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8b4513]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#8b4513]"
            />

            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#8b4513] px-4 py-3 font-semibold text-white transition hover:bg-[#6f3610] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-[#8b4513] hover:underline"
          >
            Create account
          </Link>
        </p>

        {/* Back to Home */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#8b4513]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}