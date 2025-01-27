"use client"

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type SubmitProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function Submit(props: SubmitProps) {
    const { disabled, ...otherProps } = props
    const status = useFormStatus();
    return (
        <Button 
            className="bg-gray-500 text-white"
            {...otherProps} disabled={status.pending || disabled}
        >
            {status.pending ? "Processando..." : props.children}
        </Button>
    )
}
