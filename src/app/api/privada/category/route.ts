import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

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
        orderBy: { createdAt: 'desc' }
      });
    } else {
      const skip = (page - 1) * pageSize;
      categories = await prisma.category.findMany({
        where,
        skip,
        take: pageSize,
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
  
export async function POST(request: Request) {

      const authError = await requireAdmin(request);
      if (authError) {
          return authError;
      }

    try {
        const body = await request.json();

        const category = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description,
                imageUrl: body.imageUrl || null
            }
        });

        return NextResponse.json({ message: 'Category created successfully', data: category }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {

      const authError = await requireAdmin(request);
      if (authError) {
          return authError;
      }

    try {
        const body = await request.json();

        const category = await prisma.category.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description,
                imageUrl: body.imageUrl || null
            }
        });

        return NextResponse.json({ message: 'Category updated successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

      const authError = await requireAdmin(request);
      if (authError) {
          return authError;
      }
      
    try {
        const { id } = await request.json();

        // Busca a categoria antes de deletar para pegar a imagem
        const categoryToDelete = await prisma.category.findUnique({ where: { id } });

        // Deleta a categoria do banco
        const category = await prisma.category.delete({
            where: { id }
        });

        // Remove a imagem do disco, se existir
        if (categoryToDelete?.imageUrl) {
            try {
                const imagePath = categoryToDelete.imageUrl.startsWith("/categoriesImg/")
                    ? require('path').join(process.cwd(), 'public', categoryToDelete.imageUrl)
                    : null;
                if (imagePath) {
                    await require('fs/promises').unlink(imagePath);
                }
            } catch (imgErr) {
                console.error("Erro ao remover imagem da categoria:", imgErr);
            }
        }

        return NextResponse.json({ message: 'Category deleted successfully', data: category }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
