"use client"

export default function ButtonDelete({ id }: { id: string }) {
    const handleDelete =  async () => {

        const response = await fetch(`/api/faq`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })

        if (!response.ok) {
            alert("Erro ao deletar a FAQ")
        }

        alert("FAQ deletada com sucesso!");
        window.location.reload();
    }
    return (
        <div>
            <button onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600 font-semibold py-[6px] px-3 rounded-md transition duration-300 ease-in-out">
                Excluir
            </button>
        </div>
    )
}