"use client"

import { useActionState, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type HTMLFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

type FormProps = PropsWithChildren<Omit<HTMLFormProps, "action"> & { action: (prevState: any, formData: FormData) => Promise<any> }>;

export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.action, { error: null, success: null, confirm: null });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (state.success) {
            toast.success(state.success, {
                position: "top-right",
                autoClose: 3000,
            });
            setIsSubmitted(true);
        } else if (state.error) {
            toast.error(state.error, {
                position: "top-right",
                autoClose: 3000,
            });
        } else if (state.confirm) {
            toast.info(state.confirm, {
                position: "top-right",
                autoClose: 5000,
            })
        };

    }, [state.success, state.error, state.confirm]);

    return (
        <form {...props} action={formAction}>
            <ToastContainer />
            {state.confirm && (
                <div className="flex flex-col items-center justify-center p-8 bg-white border border-pink-900 rounded-lg shadow-lg mt-6">
                    <p className="text-lg text-gray-700 mb-4 text-center">
                        Agora, para concluir o processo, por favor, verifique seu e-mail e confirme sua identidade.
                    </p>
                    <p className="font-semibold text-pink-900 text-lg text-center">
                        Enviamos um e-mail de confirmação. Não se esqueça de verificar a sua caixa de entrada.
                    </p>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">Se você não recebeu o e-mail, verifique sua pasta de spam.</p>
                    </div>
                </div>
            )}

            {!isSubmitted && !state.confirm && props.children}

            {isSubmitted && !state.confirm && <p className="font-semibold text-green-700 text-lg mb-4 text-center">{state.success}</p>}
        </form>
    );
}
