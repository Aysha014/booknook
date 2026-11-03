"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import { saveUser } from "@/lib/store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    const name = email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    saveUser({
      name,
      email,
      photoURL: "",
    });

    toast.success("Welcome back to BookNook!");
    router.push(params.get("next") || "/");
  }

  function google() {
    toast(
      "Google sign-in will be connected with BetterAuth during backend integration."
    );
  }

  return (
    <div className="container">
      <div className="auth-layout">
        {/* Login Illustration */}
        <div className="auth-art">
          <div>
            <span className="eyebrow">WELCOME BACK, READER</span>
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
            <div className="form-group">
              <label>Email address</label>
              <input
                className="field"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="field"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Log in to BookNook
              <BookOpen size={16} />
            </button>
          </form>

          <div className="divider-or">OR CONTINUE WITH</div>

          <button className="google-btn" onClick={google}>
            <b style={{ color: "#4285F4", fontSize: 18 }}>G</b>
            Continue with Google
          </button>

          <div className="auth-switch">
            New to BookNook?{" "}
            <Link href="/register">Create an account</Link>
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