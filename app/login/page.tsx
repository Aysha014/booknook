
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Validate email
    if (!trimmedEmail || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to BookNook!");

      const nextRoute = params.get("next") || "/";
      router.push(nextRoute);
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
  try {
    setGoogleLoading(true);

    await authClient.signIn.social({
      provider: "google",
      callbackURL: params.get("next") || "/",
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    toast.error("Google sign-in failed. Please try again.");
    setGoogleLoading(false);
  }
}

  return (
    <div className="container">
      <div className="auth-layout">

        {/* Login Illustration */}
        <div className="auth-art">
          <div>
            <span className="eyebrow">
              WELCOME BACK, READER
            </span>

            <h2>Your next chapter is waiting.</h2>

            <p>
              Pick up where you left off. Your bookshelf misses you.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=85"
            alt="Books on a table"
          />
        </div>

        {/* Login Form */}
        <div className="auth-form">
          <span className="eyebrow">GOOD TO SEE YOU</span>

          <h1>Welcome back!</h1>

          <p>Log in to your BookNook account.</p>

          <form onSubmit={submit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                className="field"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  id="password"
                  className="field"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Forget Password */}
            <div className="forgot-password" style={{ color: "#EF4444", fontSize: 13, fontWeight: 600, cursor: "default" }}>
              
                Forgot password?
              
            </div>

            {/* Login Button */}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in to BookNook"}
              {!loading && <BookOpen size={16} />}
            </button>
          </form>

          {/* Google Login */}
          <div className="divider-or">
            OR CONTINUE WITH
          </div>

          <button
            type="button"
            className="google-btn"
            onClick={google}
            disabled={googleLoading}
          >
            <b style={{ color: "#4285F4", fontSize: 18 }}>
              G
            </b>

            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Register Link */}
          <div className="auth-switch">
            New to BookNook?{" "}
            <Link href="/register">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="page-wrap">
      <Suspense
        fallback={
          <div className="page-loader">
            <span className="spinner" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
