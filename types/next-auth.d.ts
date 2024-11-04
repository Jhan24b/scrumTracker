import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Añadimos el campo `id`
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: User;
  }
}
