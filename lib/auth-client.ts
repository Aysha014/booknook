import { createAuthClient } from "better-auth/react";

// baseURL is intentionally omitted — Better Auth defaults to the current
// window.location.origin, which is correct for a Next.js monorepo.
export const authClient = createAuthClient();
