import ModalDeletar from "../../components/ModalDeletar";
import ButtonAdicionar from "../../components/ModalGeneric";

export default function TableMobile({
  data,
  createButtonConfig,
}: {
  data: {
    usuarios: { id: string; name: string; email: string; role: string; active: boolean }[];
    totalRecords: number;
  };
  createButtonConfig: (action: string, userId?: string, initialValues?: any) => any;
}) {
  return (
    <div className="xl:hidden flex flex-col space-y-1">
      {data.usuarios.map((usuario) => (
        <div
          key={usuario.id}
          className="flex flex-col md:flex-row p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4 md:space-y-0 md:space-x-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">{usuario.name}</h3>
            <span
              className={`text-sm font-medium ${usuario.active ? 'text-green-600' : 'text-red-600'} md:ml-4`}
            >
              {usuario.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="flex flex-col md:w-1/3">
            <p className="text-sm text-gray-600 mb-2 md:mb-0">Email: {usuario.email}</p>
          </div>

          <div className="flex flex-col md:w-1/3">
            <p className="text-sm text-gray-600 mb-2 md:mb-0">Permissão: {usuario.role}</p>
          </div>

          <div className="flex flex-col md:flex-row md:w-1/3 mt-4 md:mt-0 space-y-3 md:space-y-0 md:space-x-4 justify-end">
            <ButtonAdicionar
              config={createButtonConfig("Editar", usuario.id, {
                name: usuario.name,
                email: usuario.email,
                role: usuario.role,
                status: usuario.active,
              })}
            />
            <ModalDeletar
              config={{
                id: usuario.id,
                title: "Tem certeza de que deseja excluir esse usuário?",
                description:
                  "Esta ação não pode ser desfeita. O usuário será excluído permanentemente.",
                apiEndpoint: `${process.env.NEXTAUTH_URL}/api/privada/user`,
                urlRevalidate: "/dashboard/usuarios",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
