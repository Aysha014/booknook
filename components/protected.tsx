
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { getUser } from "@/lib/store";

export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!getUser()) {
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    } else {
      setReady(true);
    }
  }, [path, router]);

  if (!ready) {
    return (
      <div className="page-loader">
        <span className="spinner" />
        <p>Checking your bookshelf…</p>
      </div>
    );
  }

  return <>{children}</>;
}
