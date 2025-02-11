import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role?: string 
            active: boolean

        }
    }
    interface User {
        role: string | undefined
        active: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string | undefined
        active: boolean
    }   
}