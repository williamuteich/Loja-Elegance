import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth: NextAuthOptions = {
  pages: {
    signIn: "/login",
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
          throw new Error("O token do reCAPTCHA é obrigatório.");
        }

        const recaptchaRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
          { method: "POST" }
        );
        const recaptchaJson = await recaptchaRes.json();
        if (!recaptchaJson.success) {
          throw new Error(
            `Erro na validação do reCAPTCHA: ${recaptchaJson["error-codes"]?.join(", ") || "desconhecido"}`
          );
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
            totpSecret: true,
            provider: true,
          },
        });

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        if (user.provider === "google") {
          throw new Error("Por favor, faça login com o Google.");
        }

        if (!user.active) {
          throw new Error("Necessária validação de e-mail.");
        }

        if (!user.password) {
          throw new Error("Senha não cadastrada para esse usuário.");
        }

        const matchPassword = await bcrypt.compare(credentials.password, user.password ?? "");
        if (!matchPassword) {
          throw new Error("Senha inválida.");
        }

        if (user.role === "admin" && user.totpSecret) {
          if (!credentials.totpCode) {
            throw new Error("Código TOTP obrigatório.");
          }

          const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: "base32",
            token: credentials.totpCode,
          });

          if (!verified) {
            throw new Error("Código TOTP inválido.");
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

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1800,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {

      if (user && account?.provider === "google") {

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name ?? "",
              role: "user",
              active: true,
              provider: "google",
            },
          });

          token.userID = newUser.id;
          token.role = newUser.role;
          token.active = newUser.active;
        } else {
          token.userID = existingUser.id;
          token.role = existingUser.role;
          token.active = existingUser.active;
        }
      } else if (user) {
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
