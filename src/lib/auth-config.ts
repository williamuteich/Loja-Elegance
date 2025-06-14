import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
        totpCode: { label: "TOTP Code", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.recaptchaToken) {
          throw new Error('O token do reCAPTCHA é obrigatório.');
        }
  
        const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
          { method: 'POST' }
        );
        const recaptchaJson = await recaptchaRes.json();
        if (!recaptchaJson.success) {
          throw new Error(`Erro na validação do reCAPTCHA: ${recaptchaJson["error-codes"]?.join(", ") || "desconhecido"}`);
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            password: true,
            active: true,
            totpSecret: true
          }
        });
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }

        if (!user.active) {
          throw new Error('Necessária validação de e-mail.');
        }
        const matchPassword = await bcrypt.compare(credentials.password, user.password);
        if (!matchPassword) {
          throw new Error('Senha inválida.');
        }
        // Exige TOTP apenas para admin
        if (user.role === 'admin' && user.totpSecret) {
          if (!credentials.totpCode) {
            throw new Error('Código TOTP obrigatório.');
          }
          const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: credentials.totpCode
          });
          if (!verified) {
            throw new Error('Código TOTP inválido.');
          }
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        } as User;
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