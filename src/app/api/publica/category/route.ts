import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
  
export async function GET(request: Request) {
  
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
    const pageSize = 10;
    const fetchAll = url.searchParams.get("fetchAll") === "true";

    const where: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { 
              name: { 
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode 
              }
            },
            { 
              description: { 
                contains: search,
                mode: 'insensitive' as Prisma.QueryMode
              }
            }
          ]
        }
      : {};

    let categories;
    
    if (fetchAll) {
      categories = await prisma.category.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, imageUrl: true },
      });
    } else {
      const skip = (page - 1) * pageSize;
      categories = await prisma.category.findMany({
        where,
        skip,
        take: pageSize,
        select: { id: true, name: true, imageUrl: true },
      });
    }

    const totalRecords = await prisma.category.count({ where });

    return NextResponse.json({ 
      category: categories,
      totalRecords: fetchAll ? categories.length : totalRecords
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
