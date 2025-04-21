import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status");
    const id = url.searchParams.get('id');
    const pageSize = 10;
    const fetchAll = url.searchParams.get("fetchAll") === "true";

    const baseInclude = {
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      variants: {
        include: {
          color: true,
          stock: true,
        },
      },
    };

    let products;
    if (id) {
      products = await prisma.product.findUnique({
        where: { id },
        include: baseInclude,
      });

      if (!products) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
      }
    } else {
      const where: any = search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      if (status !== null) {
        where.active = status === "true";
      }

      const findOptions = {
        where,
        include: baseInclude,
        orderBy: { createdAt: "desc" } as const,
      };

      if (fetchAll) {
        products = await prisma.product.findMany(findOptions);
      } else {
        products = await prisma.product.findMany({
          ...findOptions,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
      }
    }

    const processProduct = (product: any) => ({
      ...product,
      variants: product.variants.map((variant: any) => ({
        ...variant,
        availableStock: Math.max(
          (variant.stock?.quantity || 0) - 0,
          0
        ),
      })),
    });

    const processedProducts = products
      ? Array.isArray(products)
        ? products.map(processProduct)
        : processProduct(products)
      : null;

    const totalRecords = await prisma.product.count({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    });

    return NextResponse.json({
      produtos: processedProducts,
      totalRecords,
    }, { status: 200 });

  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}