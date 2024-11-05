"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, Home, Clipboard, BarChart2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  userName: string;
  userArea: string;
  userAvatar: string;
}

export default function Navbar({
  userName,
  userArea,
  userAvatar,
}: NavbarProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Ensure theme is mounted before rendering to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering until theme has been mounted
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col items-center space-y-4 p-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-muted-foreground">{userArea}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <nav className="flex-grow flex flex-col p-6 w-full">
        <ul className="space-y-6">
          <NavItem icon={Home} label="Inicio" href="/" />
          <NavItem icon={Home} label="Proyectos" href="/projects" />
          <NavItem icon={Clipboard} label="Actividades" href="/actividades" />
          <NavItem icon={BarChart2} label="Dashboard" href="/dashboard" />
        </ul>
      </nav>
      <Separator />
      <div className="flex gap-2 p-4 w-full">
        <Button
          variant="outline"
          className="px-4"
          onClick={toggleTheme}
        >
          {currentTheme === "dark" ? "☀️" : "🌙"}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w">
      {/* Navbar for larger screens */}
      <div className="hidden md:flex flex-col h-screen w-72 bg-background border-r">
        <NavContent />
      </div>

      {/* Button and Sheet for smaller screens */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
  return (
    <li>
      <a
        href={href}
        className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-accent"
      >
        <Icon className="w-6 h-6 mr-2" />
        {label}
      </a>
    </li>
  );
}
