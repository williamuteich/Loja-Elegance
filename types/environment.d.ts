namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string
        JWT_SECRET: string
        SMTP_EMAIL_HOST: string
        EMAIL_USER: string
        PASSOWRD_EMAIL_PASS: string
        SMTP_NAME: string
        NEXT_PUBLIC_SUPABASE_URL: string
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string
        NEXT_TOKEN_MERCADO_PAGO: string
    }
}