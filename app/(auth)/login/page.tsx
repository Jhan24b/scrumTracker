'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const dynamic = "force-dynamic"; // Force Next.js to treat this page as dynamic

function LoginComponent() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // Avoids flash during hydration

  if (session) {
    // Optionally redirect the user if they are already logged in
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Welcome Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-primary-foreground dark:from-primary-foreground dark:to-primary flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Bienvenido a nuestra plataforma</h1>
          <p className="text-xl md:text-2xl text-white opacity-80">Gestiona tus proyectos y actividades de forma eficiente</p>
        </div>
      </div>

      {/* Login Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-6 pt-6">
            <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
            <Button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full max-w-sm"
              variant="outline"
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Iniciar sesión con Google
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  );
}
