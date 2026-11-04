
"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/protected";
import { authClient } from "@/lib/auth-client";
import { getBooks, getBorrows } from "@/lib/store";

export default function Profile() {
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;

  const [imageError, setImageError] = useState(false);
  const [booksAdded, setBooksAdded] = useState(0);
  const [booksBorrowed, setBooksBorrowed] = useState(0);

  useEffect(() => {
    setImageError(false);
  }, [user?.image]);

  useEffect(() => {
    if (user?.email) {
      const books = getBooks();
      const borrows = getBorrows();

      setBooksAdded(
        books.filter(
          (book) => book.addedByEmail === user.email
        ).length
      );

      setBooksBorrowed(
        borrows.filter(
          (borrow) => borrow.userEmail === user.email
        ).length
      );
    }
  }, [user?.email]);

  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() || "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">YOUR ACCOUNT</span>
            <h1 className="page-title">My profile</h1>
            <p className="page-intro">
              Manage your account and explore your BookNook activity.
            </p>
          </div>

          {user && (
            <>
              <div className="form-card" style={{ maxWidth: 650 }}>
                <h2 style={{ marginTop: 0, marginBottom: 22 }}>
                  Account information
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      minWidth: 50,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#6D4AFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      flexShrink: 0,
                    }}
                  >
                    {user.image && !imageError ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        onError={() => setImageError(true)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  <div>
                    <h2 style={{ margin: "0 0 5px" }}>
                      {user.name}
                    </h2>
                    <p style={{ margin: 0, color: "var(--muted)" }}>
                      {user.email}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 28,
                    borderTop: "1px solid var(--border)",
                    paddingTop: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>
                      Full name
                    </span>
                    <strong>{user.name}</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>
                      Email address
                    </span>
                    <strong>{user.email}</strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: "var(--muted)" }}>
                      Member since
                    </span>
                    <strong>{memberSince}</strong>
                  </div>
                </div>
              </div>

              <div style={{ maxWidth: 650, marginTop: 25 }}>
                <h2 style={{ marginBottom: 16 }}>
                  My BookNook activity
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 16,
                  }}
                >
                  <div className="form-card">
                    <p style={{ color: "var(--muted)", margin: "0 0 8px" }}>
                      Books added
                    </p>
                    <h2
                      style={{
                        fontSize: 32,
                        margin: 0,
                        color: "var(--accent)",
                      }}
                    >
                      {booksAdded}
                    </h2>
                  </div>

                  <div className="form-card">
                    <p style={{ color: "var(--muted)", margin: "0 0 8px" }}>
                      Books borrowed
                    </p>
                    <h2
                      style={{
                        fontSize: 32,
                        margin: 0,
                        color: "var(--accent)",
                      }}
                    >
                      {booksBorrowed}
                    </h2>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Protected>
  );
}
