import Container from "./(page)/components/Container";


export default async function Dashboard() {
  return (
    <Container>
      <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard!</h1>
      
      <div className="mt-6 p-4">
        <h2 className="text-xl font-semibold">Resumo</h2>
        <p>Algumas estatísticas e informações do painel...</p>
      </div>
    </Container>
  );
}
