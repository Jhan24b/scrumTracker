import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account!.provider === "google") {
        // Busca si ya existe el usuario
        const existingUser = await prisma.usuario.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const newUser = await prisma.usuario.create({
            data: {
              email: user.email!,
              nombre: profile!.name || "Usuario de Google",
            },
          });

          // Crea una cuenta en la tabla Account
          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
              type: 'oauth',
              access_token: account!.access_token,
              refresh_token: account!.refresh_token,
              expires_at: account!.expires_at,
              token_type: account!.token_type,
              id_token: account!.id_token,
            },
          });


        } else {
          // Si el usuario ya existe, revisa si ya tiene una cuenta de Google
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
              userId: existingUser.id,
            },
          });

          if (!existingAccount) {
            // Si no tiene cuenta de Google asociada, la creamos
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account!.provider,
                providerAccountId: account!.providerAccountId,
                type: 'oauth',
                access_token: account!.access_token,
                refresh_token: account!.refresh_token,
                expires_at: account!.expires_at,
                token_type: account!.token_type,
                id_token: account!.id_token,
              },
            });
          }
        }

        return true;
      }
      return false;
    },
    async session({ session, token }) {
      // Añadir el id del usuario a la sesión

      const existingSession = await prisma.session.findFirst({
        where: { userId: token.id as string },
      });

      if (!existingSession) {
        // Si no hay una sesión para este usuario, la creamos
        await prisma.session.create({
          data: {
            sessionToken: token.jti as string,
            userId: token.id as string,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expira en 30 días
          },
        });
      }

      if (token) {
        session!.user!.id = token.id as string;
        session!.user!.name = token.name;
        session!.user!.email = token.email;
        session!.user!.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Añadir el id del usuario al token
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return url;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de tener esta variable de entorno configurada
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const auth = authOptions;