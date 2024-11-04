import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Permitir acceso a la página de login y rutas API
  if (pathname.startsWith("/login") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Si hay sesión activa, permitir acceso a cualquier página
  if (token) {
    // Ya tiene sesión, así que no debería redirigir a login
    return NextResponse.next();
  }

  // Si no tiene sesión y está intentando acceder a rutas protegidas
  if (
    pathname === "/" ||
    pathname.startsWith("/cursos") ||
    pathname.startsWith("/horario") ||
    pathname.startsWith("/pagos") ||
    pathname.startsWith("/servicios") ||
    pathname.startsWith("/tramites") ||
    pathname.startsWith("/cancel") ||
    pathname.startsWith("/success")
  ) {
    // Redirigir al login si no tiene token
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
