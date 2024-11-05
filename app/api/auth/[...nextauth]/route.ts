import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Ruta actualizada

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };