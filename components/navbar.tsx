
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserRound,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getUser, saveUser } from "@/lib/store";
import type { User } from "@/lib/types";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);

  const router = useRouter();

  // Load user and theme when the component mounts
  useEffect(() => {
    setUser(getUser());

    const savedTheme = localStorage.getItem("booknook_theme");
    const isDark =
      savedTheme === "dark" ||
      document.documentElement.classList.contains("dark");

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    const syncUser = () => {
      setUser(getUser());
    };

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Toggle light and dark themes
  function toggleTheme() {
    const nextTheme = !dark;

    setDark(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme
    );

    localStorage.setItem(
      "booknook_theme",
      nextTheme ? "dark" : "light"
    );
  }

  // Logout user
  function logout() {
    saveUser(null);
    setUser(null);
    setOpen(false);
    setMenu(false);

    router.push("/");
  }

  // Navigation links
  const links = [
    ["Home", "/"],
    ["All Books", "/books"],
  ];

  // Get user's initial for the profile avatar
  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="nav-shell">
      <nav className="container nav-inner">

        {/* Brand Logo */}
        <Link href="/" className="brand">
          <span className="brand-mark">
            <BookOpen size={21} />
          </span>

          <span>
            booknook<span className="brand-dot">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-links">
          {links.map(([name, href]) => (
            <Link key={href} href={href}>
              {name}
            </Link>
          ))}

          {user && (
            <>
              <Link href="/add-book">Add Book</Link>
              <Link href="/my-books">My Books</Link>
              <Link href="/my-borrows">My Borrows</Link>
            </>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">

          {/* Theme Toggle */}
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Logged-in User */}
          {user ? (
            <div className="profile-wrap">

              <button
                className="profile-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                  />
                ) : (
                  <span className="profile-avatar-placeholder">
                    {userInitial}
                  </span>
                )}

                <span>
                  {user.name.split(" ")[0]}
                </span>

                <ChevronDown size={15} />
              </button>

              {/* Profile Dropdown */}
              {open && (
                <div className="profile-menu">

                  <div className="profile-meta">
                    <b>{user.name}</b>
                    <small>{user.email}</small>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                  >
                    <UserRound size={16} />
                    My Profile
                  </Link>

                  <button onClick={logout}>
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (

            /* Logged-out Actions */
            <div className="auth-actions">
              <Link
                className="btn btn-ghost btn-small"
                href="/login"
              >
                Log in
              </Link>

              <Link
                className="btn btn-primary btn-small"
                href="/register"
              >
                Join free <span>↗</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menu && (
          <div className="mobile-menu">

            {[ 
              ...links,
              ...(user
                ? [
                    ["Add Book", "/add-book"],
                    ["My Books", "/my-books"],
                    ["My Borrows", "/my-borrows"],
                  ]
                : []),
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenu(false)}
              >
                {name}
              </Link>
            ))}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenu(false)}
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenu(false)}
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <button onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            )}

          </div>
        )}

      </nav>
    </header>
  );
}
