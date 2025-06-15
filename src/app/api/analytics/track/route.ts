import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { path, type, clientId, timestamp } = await request.json();
    
    if (!timestamp || typeof timestamp !== 'string') {
      return NextResponse.json(
        { error: 'Invalid timestamp format' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const date = new Date(timestamp);
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (isNaN(localDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date' },
        { status: 400 }
      );
    }

    if (type === 'page_view') {
      // Verificar se já existe uma visita para este cliente neste dia
      const existingVisit = await prisma.pageView.findFirst({
        where: {
          AND: [
            { date: localDate },
            { clientId }
          ]
        }
      });

      if (!existingVisit) {
        // Se não existe, criar nova entrada
        await prisma.pageView.create({
          data: { 
            date: localDate, 
            clientId,
            count: 1 
          }
        });
      } else {
        // Se já existe, não fazer nada
        console.log('Visit already counted for this client today');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}