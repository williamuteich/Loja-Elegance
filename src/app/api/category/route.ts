import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
  
  export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search');
      const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!, 10) : 1;
      const pageSize = 10;
  
      const skip = (page - 1) * pageSize;
  
      const categories = await prisma.category.findMany({
        skip,
        take: pageSize,
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
      });
  
      const totalRecords = await prisma.category.count({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
      });
  
      return NextResponse.json({ category: categories, totalRecords }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const category = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description
            }
        });

        return NextResponse.json({ message: 'Category created successfully', data: category }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const category = await prisma.category.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description
            }
        });

        return NextResponse.json({ message: 'Category updated successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const category = await prisma.category.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Category deleted successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
