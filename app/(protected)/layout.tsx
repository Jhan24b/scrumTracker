// Importa la configuración de NextAuth y getServerSession
import { getServerSession } from "next-auth";

import Navbar from "../components/navbar";
import { auth } from "../api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtiene la sesión en el lado del servidor
  const session = await getServerSession(auth);

  // Extrae los datos necesarios del usuario
  const userName = session?.user?.name || "Invitado";
  const userArea = "Área desconocida";
  const userAvatar = session?.user?.image || "/default-avatar.png"; // Ruta de avatar por defecto si no existe

  return (
    <main className="h-screen font-inter">
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          <Navbar
            userName={userName}
            userArea={userArea}
            userAvatar={userAvatar}
          />
          {children}
        </div>
      </div>
    </main>
  );
}