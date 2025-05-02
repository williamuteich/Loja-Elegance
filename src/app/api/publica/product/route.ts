// src/app/api/publica/product/route.ts

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
    const randomLimit = parseInt(url.searchParams.get("randomLimit") || "10", 10);

    const baseInclude = {
      brand: true,
      categories: { include: { category: true } },
      variants: { include: { color: true, stock: true } },
    };

    let products: any;

    // 1️⃣ Se veio um ID, busca somente esse produto
    if (id) {
      products = await prisma.product.findUnique({
        where: { id },
        include: baseInclude,
      });

      if (!products) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }
    } else {
      // 2️⃣ Monta filtros comuns
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

      // 3️⃣ Random ou paginação/fetchAll
      if (random) {
        const allProducts = await prisma.product.findMany({
          where,
          include: baseInclude,
          orderBy: { createdAt: Prisma.SortOrder.desc },
        });
        // embaralha e pega só até randomLimit
        const shuffled = allProducts.sort(() => Math.random() - 0.5);
        products = shuffled.slice(0, randomLimit);
      } else {
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
    }

    // 4️⃣ Processa para adicionar availableStock em cada variante
    const processProduct = (product: any) => ({
      ...product,
      variants: product.variants.map((variant: any) => ({
        ...variant,
        availableStock: Math.max((variant.stock?.quantity || 0) - 0, 0),
      })),
    });

    const processedProducts = Array.isArray(products)
      ? products.map(processProduct)
      : processProduct(products);

    // 5️⃣ Conta total para paginação (ignora `id` e `random`, pois só importa quando listando)
    const countWhere: any = {};
    if (search) {
      countWhere.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }
    if (status !== null) {
      countWhere.active = status === "true";
    }
    if (categoria) {
      countWhere.categories = {
        some: { category: { name: categoria } },
      };
    }
    if (precoMin || precoMax) {
      countWhere.price = {};
      if (precoMin) countWhere.price.gte = Number(precoMin);
      if (precoMax) countWhere.price.lte = Number(precoMax);
    }

    const totalRecords =
      id || random
        ? Array.isArray(products)
          ? products.length
          : 1
        : await prisma.product.count({ where: countWhere });

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
