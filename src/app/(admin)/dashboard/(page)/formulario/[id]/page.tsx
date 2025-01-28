import { SendWelcomeEmail } from "@/usecases/SendWelcomeEmail";
import Container from "../../components/Container";
import Form from "@/components/Form";
import { Button } from "@/components/ui/button";
import Submit from "@/components/Submit";

export default async function RespFormulario({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/formContact?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        return <div>Erro ao carregar formulário</div>;
    }

    const { formContacts } = await res.json();

    async function loadingAction(prevState: any, formData: FormData) {
        "use server"
        const getText = formData.get("textArea") as string;

        if (getText === "") {
            return { error: 'Campo "Resposta" é Obrigatório' };
        }
      
        const usecase = new SendWelcomeEmail();

        const result = await usecase.execute(formContacts.email, getText);

        if (result.success) {
            return { success: "Enviado com Sucesso" };
        }

        if (!result.success) {
            return { error: result.error || "Algo Deu Errado" };
        }
    }

    return (
        <Container>
            <div className="space-y-6">
                <h2 className="text-3xl font-semibold mb-3 text-gray-800">Responder ao Formulário</h2>
                <p className="text-gray-600 mb-10 text-sm leading-[1.6]">
                    Aqui você pode visualizar as mensagens enviadas pelos usuários e responder diretamente a elas. Utilize esta página para interagir com seus clientes, esclarecer dúvidas, resolver problemas ou fornecer mais informações sobre seus serviços.
                </p>

                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {formContacts && (
                        <>
                            <div className="space-y-2">
                                <p><strong>ID:</strong> {formContacts.id}</p>
                                <p><strong>Nome:</strong> {formContacts.name}</p>
                                <p><strong>Email:</strong> {formContacts.email}</p>
                                <p><strong>Telefone:</strong> {formContacts.telefone}</p>
                                <p><strong>Assunto:</strong> {formContacts.assunto}</p>
                                <div className="flex flex-col mt-8">
                                    <strong>Mensagem:</strong>
                                    <p className="bg-slate-100 p-4">{formContacts.mensagem}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <Form action={loadingAction} className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Sua Resposta</h3>
                    <textarea
                        name="textArea"
                        className="w-full h-40 p-4 border border-gray-300 rounded-md resize-none"
                        placeholder="Digite sua resposta aqui..."
                    />

                    <div className="flex justify-end space-x-3 text-white">
                        <Submit
                            className="bg-green-800 text-white hover:bg-green-600"
                        >
                            Enviar Resposta
                        </Submit>
                    </div>
                </Form>
            </div>
        </Container>
    );
}
