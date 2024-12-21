import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role?: string 

        }
    }
    interface User {
        role: string | undefined
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string | undefined
    }   
}