import { SendWelcomeEmail } from "@/usecases/SendWelcomeEmail";
import Container from "../../components/Container";
import Form from "@/components/Form";
import Submit from "@/components/Submit";
import { Formulario } from "@/utils/types/formulario";
import { cookies } from "next/headers";

export default async function RespFormulario({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/formContact?id=${id}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store"
  });

  if (!res.ok) return <div>Erro ao carregar formulário</div>;

  const { formContacts }: { formContacts: Formulario } = await res.json();

  async function handleSubmit(prevState: any, formData: FormData) {
    "use server";
    const resposta = formData.get("textArea") as string;

    if (!resposta) return { error: 'Campo "Resposta" é obrigatório' };

    const usecase = new SendWelcomeEmail();
    const result = await usecase.execute(formContacts.email, resposta);

    if (!result.success) return { error: result.error || "Erro ao enviar resposta" };

    await fetch(`${process.env.NEXTAUTH_URL}/api/formContact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: formContacts.id, resposta }),
    });

    return { success: "Resposta enviada com sucesso!" };
  }

  return (
    <Container>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Responder ao Formulário</h2>
        <p className="text-gray-600 text-sm leading-[1.6]">
          Visualize e responda às mensagens dos usuários. Interaja com seus clientes, esclareça dúvidas e forneça informações.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          {formContacts && (
            <>
              <p><strong>ID:</strong> {formContacts.id}</p>
              <p><strong>Nome:</strong> {formContacts.name}</p>
              <p><strong>Email:</strong> {formContacts.email}</p>
              <p><strong>Telefone:</strong> {formContacts.telefone}</p>
              <p><strong>Assunto:</strong> {formContacts.assunto}</p>
              <div className="flex flex-col mt-8">
                <strong>Mensagem:</strong>
                <p className="bg-slate-100 p-4">{formContacts.mensagem}</p>
              </div>
            </>
          )}
        </div>

        {formContacts.respondido ? (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-2">Resposta Enviada</h3>
            <p className="text-gray-700 text-base leading-relaxed bg-gray-100 p-4">{formContacts.resposta}</p>
          </div>
        ) : (
          <Form action={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Sua Resposta</h3>
            <textarea
              name="textArea"
              className="w-full h-40 p-4 border border-gray-300 rounded-md resize-none"
              placeholder="Digite sua resposta aqui..."
              required
            />
            <div className="flex justify-end space-x-3 text-white">
              <Submit className="bg-green-800 hover:bg-green-600">Enviar Resposta</Submit>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
}