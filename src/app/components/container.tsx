import { ReactNode } from "react";

export function Container({ children }: { children: ReactNode}) {
    return(
        <div className="max-w-[1400px] mx-auto px-4 w-full sm:px-6 lg:px-8">
            { children }
        </div>
    )
}