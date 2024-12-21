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
          const response = await fetch(`${process.env.NEXT_API}/login`, {
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

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
