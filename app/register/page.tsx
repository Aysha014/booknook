
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Password validation
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

    // Name validation
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    toast.success("Registration details accepted. Please log in.");
    router.push("/login");
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="auth-layout">

          {/* Registration Illustration */}
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

          {/* Registration Form */}
          <div className="auth-form">
            <span className="eyebrow">START YOUR STORY</span>

            <h1>Create account</h1>
            <p>Make a little space for more stories.</p>

            <form onSubmit={submit}>

              {/* Name */}
              <div className="form-group">
                <label>Your name</label>

                <input
                  className="field"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
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

              {/* Photo URL */}
              <div className="form-group">
                <label>Photo URL</label>

                <input
                  className="field"
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://... (optional)"
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>

                <input
                  className="field"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />

                <span className="form-help">
                  Include at least one uppercase and one lowercase letter.
                </span>
              </div>

              <button className="btn btn-primary">
                Create my account
                <BookOpen size={16} />
              </button>
            </form>

            {/* Google Registration */}
            <div className="divider-or">OR</div>

            <button
              className="google-btn"
              onClick={() =>
                toast(
                  "Google sign-up will be connected with BetterAuth during backend integration."
                )
              }
            >
              <b style={{ color: "#4285F4", fontSize: 18 }}>G</b>
              Sign up with Google
            </button>

            {/* Login Link */}
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
