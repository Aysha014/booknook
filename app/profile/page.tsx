"use client";
import Protected from "@/components/protected";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;

  return (
    <Protected>
      <div className="page-wrap">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">YOUR ACCOUNT</span>
            <h1 className="page-title">My profile</h1>
          </div>
          <div className="form-card" style={{ maxWidth: 520 }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    style={{ width: 75, height: 75, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {user.name?.trim().charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <h2 style={{ margin: "0 0 5px" }}>{user.name}</h2>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{user.email}</p>
                </div>
              </div>
            )}
            <p className="form-help" style={{ marginTop: 25 }}>
              Profile editing and secure account management are powered by Better Auth.
            </p>
          </div>
        </div>
      </div>
    </Protected>
  );
}
