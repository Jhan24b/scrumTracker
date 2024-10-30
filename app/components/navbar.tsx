'use client'

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, Home, Clipboard, BarChart2, LogOut } from 'lucide-react';

interface NavbarProps {
  userName: string;
  userArea: string;
  userAvatar: string;
}

export default function Navbar({ userName, userArea, userAvatar }: NavbarProps) {
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

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
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
      <nav className="flex-grow flex flex-col p-6">
        <ul className="space-y-6">
          <NavItem icon={Home} label="Proyectos" href="/proyectos" />
          <NavItem icon={Clipboard} label="Actividades" href="/actividades" />
          <NavItem icon={BarChart2} label="Dashboard" href="/dashboard" />
        </ul>
      </nav>
      <Separator />
      <div className="flex flex-col gap-4 px-4 py-4">
        <Button variant="outline" className="w-full justify-start" onClick={toggleTheme}>
          {currentTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={() => console.log('Cerrar sesión')}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Navbar para pantallas grandes */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-background border-r">
        <NavContent />
      </div>

      {/* Botón y Sheet para pantallas pequeñas */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
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
