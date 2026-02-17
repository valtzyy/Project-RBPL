import "better-auth";

declare module "better-auth" {
  interface User {
    role: "ADMIN_GUDANG" | "ADMIN_DIST" | "MANAJEMEN";
  }
}
