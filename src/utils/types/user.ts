export interface UserProps {
    name: string;
    email: string;
    telefone: string;
    user: {
        userID: string;
        image: string | undefined;
        role: string;
        active: boolean;
    };
}

export interface EnderecoProps {
    logradouro: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
    numero?: string;       
    complemento?: string;  
    pais?: string;         
  }
  