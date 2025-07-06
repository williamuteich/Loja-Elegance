import 'dotenv/config';

export async function resetExpiredPromotions() {
  try {
    //tem que passar a url de prod
    //const response = await fetch(`http://localhost:3000/api/privada/revalida-produto`
    const response = await fetch(`http://localhost:3000/api/privada/revalida-produto`, {
      method: 'PATCH',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao chamar API:', data.error || response.statusText);
      return;
    }

    console.log(`✅ ${data.message}`);
  } catch (error) {
    console.error('Erro ao chamar a API de revalidação:', error);
  }
}
