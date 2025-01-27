"use client"

import { useEffect } from "react";
import { PropsWithChildren, useActionState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type HTMLFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

type FormProps = PropsWithChildren<Omit<HTMLFormProps, "action"> & { action: (prevState: any, formData: FormData) => Promise<any> }>;

export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.action, { error: null, success: null });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success, {
                position: "top-right",
                autoClose: 3000,
            });
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
            {props.children} 
        </form>
    )
}
