
"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Send } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Demo only: Actual reset email will be handled by BetterAuth.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Password reset request submitted!");
    }, 800);
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="auth-layout">

          {/* Illustration Section */}
          <div className="auth-art">
            <div>
              <span className="eyebrow">
                NO WORRIES, READER
              </span>

              <h2>Every story deserves another chapter.</h2>

              <p>
                Forgot your password? Don't worry.
                Let's help you get back to your bookshelf.
              </p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=85"
              alt="A beautiful library full of books"
            />
          </div>

          {/* Forgot Password Form */}
          <div className="auth-form">
            <span className="eyebrow">
              ACCOUNT RECOVERY
            </span>

            <div className="forgot-icon">
              <Mail size={28} />
            </div>

            <h1>Forgot password?</h1>

            <p>
              Enter the email address associated with your
              account and we'll help you reset your password.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <Send size={16} />}
                </button>
              </form>
            ) : (
              <div className="reset-success">
                <div className="success-icon">
                  <Mail size={25} />
                </div>

                <h3>Request submitted!</h3>

                <p>
                  Your demo password reset request has been
                  received for <strong>{email}</strong>.
                  Actual email delivery will be enabled
                  during authentication integration.
                </p>

                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  Try another email
                </button>
              </div>
            )}

            <div className="auth-switch">
              <Link href="/login">
                <ArrowLeft size={15} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
