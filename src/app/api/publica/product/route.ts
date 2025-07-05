import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");
    const categoria = url.searchParams.get("categoria");
    const precoMin = url.searchParams.get("precoMin");
    const precoMax = url.searchParams.get("precoMax");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const fetchAll = url.searchParams.get("fetchAll") === "true";
    const random = url.searchParams.get("random") === "true";
    const randomLimit = parseInt(url.searchParams.get("randomLimit") || pageSize.toString(), 10);

    const baseInclude = {
      brand: true,
      categories: { include: { category: true } },
      variants: { include: { color: true, stock: true } },
    };

    let products: any;

    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }
    if (status !== null) {
      where.active = status === "true";
    }
    if (categoria) {
      where.categories = {
        some: { category: { name: categoria } },
      };
    }
    if (precoMin || precoMax) {
      where.price = {};
      if (precoMin) where.price.gte = Number(precoMin);
      if (precoMax) where.price.lte = Number(precoMax);
    }

    const totalRecords = await prisma.product.count({ where });

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: baseInclude,
      });

      if (!product) {
        return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
      }

      products = product;
    }

    else if (random) {
      const allMatching = await prisma.product.findMany({
        where,
        include: baseInclude,
      });

      const shuffled = allMatching.sort(() => Math.random() - 0.5);
      products = shuffled.slice(0, randomLimit);
    }

    else {
      const findOpts = {
        where,
        include: baseInclude,
        orderBy: { createdAt: Prisma.SortOrder.desc } as const,
      };

      if (fetchAll) {
        products = await prisma.product.findMany(findOpts);
      } else {
        products = await prisma.product.findMany({
          ...findOpts,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
      }
    }

    const processProduct = (product: any) => ({
      ...product,
      variants: product.variants.map((variant: any) => ({
        ...variant,
        availableStock: Math.max((variant.stock?.quantity || 0), 0),
      })),
    });

    const processedProducts = Array.isArray(products)
      ? products.map(processProduct)
      : processProduct(products);

    return NextResponse.json(
      { produtos: processedProducts, totalRecords },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
