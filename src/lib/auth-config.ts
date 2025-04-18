import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const auth: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "username", type: "text", placeholder: "Seu Nome" },
        email: { label: "E-mail", type: "email", placeholder: "Seu E-mail" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {

        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: credentials?.name, 
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.user;
           
            if (user) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                active: user.active,
              } as User; 
            }
          }

          return null; 
        } catch (error) {
          console.error("Erro ao autenticar com a API:", error);
          return null; 
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1800,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userID = user.id;
        token.role = user.role;
        token.active = user.active;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user.userID = token.userID;
        session.user.role = token.role;
        session.user.active = token.active;
      }
      return session;
    },
  },
};
