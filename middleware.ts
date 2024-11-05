import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Verificar si NEXTAUTH_SECRET está definido
  console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

  // Intentar obtener el token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Depuración del token y pathname
  console.log("Token obtenido:", token);
  console.log("Pathname actual:", pathname);

  // Permitir acceso a la página de login y rutas API
  if (pathname.startsWith("/login") || pathname.startsWith("/api/")) {
    console.log("Acceso permitido: login o ruta API");
    return NextResponse.next();
  }

  // Si hay sesión activa, permitir acceso a cualquier página
  if (token) {
    console.log("Sesión activa, acceso permitido");
    return NextResponse.next();
  }

  // Si no tiene sesión y está intentando acceder a rutas protegidas
  if (
    pathname === "/" ||
    pathname.startsWith("/actividades") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects")
  ) {
    console.log("Redirigiendo al login porque no hay sesión");
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  console.log("Acceso permitido: No es una ruta protegida");
  return NextResponse.next();
}
