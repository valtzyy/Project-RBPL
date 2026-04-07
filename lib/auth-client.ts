import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // Kalo lagi di Vercel (production), pake domain Vercel.
  // Kalo lagi di laptop, pake localhost.
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://sandrella-gudang.vercel.app"
      : "http://localhost:3000",
});
