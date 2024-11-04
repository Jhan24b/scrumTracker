"use client";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className= "min-h-full">
        {children}
      </div>
    </SessionProvider>
  );
}
