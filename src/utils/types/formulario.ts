export interface Formulario {
    id: string;
    name: string;
    email: string;
    telefone: string;
    assunto: string;
    mensagem: string;
    resposta?: string;
    respondido: boolean;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}