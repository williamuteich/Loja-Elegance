import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Obter os últimos 7 dias
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(0, 0, 0, 0);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    // Preencher dias faltantes com contagem zero
    const allDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i + 1);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    });

    // Agrupar por dia e somar as visitas
    const pageViews = await prisma.pageView.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        count: true
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Mapear os resultados para incluir dias sem visitas
    const result = allDays.map(date => {
      const view = pageViews.find(v => v.date.toISOString().split('T')[0] === date);
      return {
        date: date,
        count: view?._sum.count || 0,
      };
    });

    return NextResponse.json({ pageViews: result });
  } catch (error) {
    console.error('Error fetching page views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page views' },
      { status: 500 }
    );
  }
}