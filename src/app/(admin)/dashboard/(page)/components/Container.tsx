
export default function Container({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="mx-auto bg-white p-8 rounded-lg shadow-lg">
                {children}
            </div>
        </div>
    )
}