export interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "email" | "select" | "password";
    placeholder?: string;
    options?: { value: string; label: string }[];
}