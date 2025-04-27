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
    const categoria = url.searchParams.get('categoria');
    const precoMin = url.searchParams.get('precoMin');
    const precoMax = url.searchParams.get('precoMax');
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
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
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
        ];
      }
      if (status !== null) {
        where.active = status === "true";
      }
      if (categoria) {
        where.categories = {
          some: {
            category: {
              name: categoria,
            },
          },
        };
      }
      if (precoMin || precoMax) {
        where.price = {};
        if (precoMin) where.price.gte = Number(precoMin);
        if (precoMax) where.price.lte = Number(precoMax);
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

    const countWhere: any = {};
    if (search) {
      countWhere.OR = [
        { name: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status !== null) {
      countWhere.active = status === "true";
    }
    if (categoria) {
      countWhere.categories = {
        some: {
          category: {
            name: categoria,
          },
        },
      };
    }
    if (precoMin || precoMax) {
      countWhere.price = {};
      if (precoMin) countWhere.price.gte = Number(precoMin);
      if (precoMax) countWhere.price.lte = Number(precoMax);
    }

    const totalRecords = await prisma.product.count({
      where: countWhere,
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