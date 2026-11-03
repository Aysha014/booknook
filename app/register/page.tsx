
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      password.length < 6
    ) {
      toast.error(
        "Use at least 6 characters, including uppercase and lowercase letters."
      );
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photo.trim() || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google sign-up failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google sign-up failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="auth-layout">
          <div className="auth-art">
            <div>
              <span className="eyebrow">COME ON IN</span>
              <h2>Every reader belongs here.</h2>
              <p>
                Join a community that believes good stories should travel.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=85"
              alt="A cozy library"
            />
          </div>

          <div className="auth-form">
            <span className="eyebrow">START YOUR STORY</span>

            <h1>Create account</h1>
            <p>Make a little space for more stories.</p>

            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="name">Your name</label>

                <input
                  id="name"
                  className="field"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>

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

              <div className="form-group">
                <label htmlFor="photo">Photo URL</label>

                <input
                  id="photo"
                  className="field"
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://... (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  className="field"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />

                <span className="form-help">
                  Include at least one uppercase and one lowercase letter.
                </span>
              </div>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create my account"}
                {!loading && <BookOpen size={16} />}
              </button>
            </form>

            <div className="divider-or">OR</div>

            <button
              type="button"
              className="google-btn"
              onClick={google}
              disabled={googleLoading}
            >
              <b style={{ color: "#4285F4", fontSize: 18 }}>G</b>
              {googleLoading ? "Connecting..." : "Sign up with Google"}
            </button>

            <div className="auth-switch">
              Already have an account?{" "}
              <Link href="/login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
