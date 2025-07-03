interface FieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type: "text" | "email" | "password" | "select";
    options?: { value: string; label: string }[];
}

export interface ButtonAdicionarProps {
    config: {
        id?: string;
        title: string;
        description: string;
        fields: FieldConfig[];
        apiEndpoint: string;
        urlRevalidate: string[];
        method: string;
        action: string;
        initialValues?: { [key: string]: string };
    },
    params?: string;
}