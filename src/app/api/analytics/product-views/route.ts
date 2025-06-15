import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.productView.findMany({
      orderBy: { count: 'desc' },
      take: 5,
      select: {
        productId: true,
        count: true,
        productName: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { productId, productName } = await request.json(); 

    if (!productId || !productName) {
      return NextResponse.json(
        { error: 'Product ID and name are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    await prisma.productView.upsert({
      where: { productId },
      update: {
        count: { increment: 1 },
        lastView: localDate
      },
      create: {
        productId,
        productName,
        count: 1,
        firstView: localDate,
        lastView: localDate
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking product view:', error);
    return NextResponse.json(
      { error: 'Failed to track product view' },
      { status: 500 }
    );
  }
}