import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            userID: string
            role?: string 
            active: boolean

        }
    }
    interface User {
        userID: string
        role: string | undefined
        active: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userID: string
        role: string | undefined
        active: boolean
    }   
}