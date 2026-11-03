
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // Wait until the session fetch has settled before deciding
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [isPending, session, path, router]);

  // Show spinner while session is loading
  if (isPending) {
    return (
      <div className="page-loader">
        <span className="spinner" />
        <p>Checking your bookshelf…</p>
      </div>
    );
  }

  // Show spinner while redirect is in-flight (no user)
  if (!session?.user) {
    return (
      <div className="page-loader">
        <span className="spinner" />
        <p>Checking your bookshelf…</p>
      </div>
    );
  }

  return <>{children}</>;
}
