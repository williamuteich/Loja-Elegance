"use client"

import { useActionState, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type HTMLFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

type FormProps = PropsWithChildren<Omit<HTMLFormProps, "action"> & { action: (prevState: any, formData: FormData) => Promise<any> }>;

// Componente Form
export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.action, { error: null, success: null });
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controle de submissão

    useEffect(() => {
        if (state.success) {
            toast.success(state.success, {
                position: "top-right",
                autoClose: 3000,
            });
            setIsSubmitted(true); // Quando sucesso, marca o formulário como "submetido"
        } else if (state.error) {
            toast.error(state.error, {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [state.success, state.error]);

    return (
        <form {...props} action={formAction}>
            <ToastContainer />
            {!isSubmitted && props.children}
        
            {isSubmitted && <p className="font-semibold text-blue-700 text-lg mb-4">Enviado com sucesso!</p>} 
        </form>
    );
}
