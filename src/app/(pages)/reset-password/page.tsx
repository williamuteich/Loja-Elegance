import NavProfile from "@/app/components/navProfile";
import Form from "@/components/Form";
import Submit from "@/components/Submit";
import { FaKey } from "react-icons/fa";
import { cookies } from "next/headers";

export default async function ResetPassword() {

    async function handlePassword(prevState: any, formData: FormData): Promise<{ success?: string; error?: string }> {
        "use server";

        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/privada/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            return { error: "Error al restablecer la contraseña" };
        }

        const result = await response.json();
        return { success: "Contraseña actualizada con éxito" };
    }
    return (
        <div className="w-full mx-auto py-12 flex gap-4 flex-col lg:flex-row">
            <NavProfile />
            <div className="flex w-full flex-col bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-pink-700 flex gap-3 items-center">
                    <FaKey size={28} />
                    Restablecer Contraseña
                </h2>
                <Form action={handlePassword} className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Contraseña Actual</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Ingrese su contraseña actual"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Ingrese su nueva contraseña"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Repetir Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Repita su nueva contraseña"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Submit className="bg-pink-700 w-full hover:bg-pink-600 text-white" type="submit">Guardar</Submit>
                    </div>
                </Form>
            </div>
        </div>
    );
}
