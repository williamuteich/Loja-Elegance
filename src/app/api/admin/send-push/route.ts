import { NextRequest, NextResponse } from 'next/server';
import { sendNotification } from '@/app/actions/pwaActions';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ success: false, error: 'Mensagem inválida' }, { status: 400 });
  }
  try {
    const result = await sendNotification(message);
    return NextResponse.json({ success: true, sent: result.sent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao enviar notificações' }, { status: 500 });
  }
}
