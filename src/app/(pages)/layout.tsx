import Header from "@/app/components/header/header";
import "../globals.css";
import Footer from "@/app/components/footer/footer";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Header />
            <div className="max-w-[1400px] mx-auto px-2 w-full sm:px-6 lg:px-8">
                {children}
            </div>
            <Footer />
        </div>
    );
}
