import "../globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="max-w-[1400px] mx-auto px-4 w-full sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
}
