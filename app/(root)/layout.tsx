import Navbar from "../components/navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen font-inter">
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          <Navbar
            userName="Manuel"
            userArea="Desarrollo"
            userAvatar="blanquito"
          />

          {children}
        </div>
      </div>
    </main>
  );
}
