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
    const random = url.searchParams.get("random") === "true";
    const randomLimit = parseInt(url.searchParams.get("randomLimit") || "10", 10);

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

    if (random) {
      const where: any = { active: true };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
        ];
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

      const allProducts = await prisma.product.findMany({
        where,
        include: baseInclude,
        orderBy: { createdAt: Prisma.SortOrder.desc },
      });

      // Embaralha e pega os produtos aleatórios
      const shuffled = allProducts.sort(() => Math.random() - 0.5);
      const produtos = shuffled.slice(0, randomLimit);

      return NextResponse.json({ produtos, totalRecords: allProducts.length }, { status: 200 });
    } else {
      // Caso não seja aleatório, retorna paginando os produtos
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
        orderBy: { createdAt: Prisma.SortOrder.desc },
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
