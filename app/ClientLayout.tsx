"use client";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Set mounted to true only after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering ThemeProvider or Toaster until mounted on client
    return null;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system">
        <Toaster />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
