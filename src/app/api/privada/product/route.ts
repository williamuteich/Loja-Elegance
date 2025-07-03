import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/utils/auth";

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
    console.log("consumindo api")
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

export async function POST(request: Request) {

  const authError = await requireAdmin(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    console.log("recebendo dados do produto:", body);
    const requiredFields = [
      'name',
      'description',
      'price',
      'brandId',
      'features',
      'categoryIds',
      'variants'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`,
          required: {
            name: "string",
            description: "string",
            price: "number",
            brandId: "string (ObjectId)",
            features: "string",
            categoryIds: "string[] (ObjectIds)",
            variants: "Array<{ name: string, hexCode: string, quantity: number }>"
          }
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.variants) || body.variants.length === 0) {
      return NextResponse.json(
        { error: "Deve haver pelo menos uma variante" },
        { status: 400 }
      );
    }

    const hexCodes = body.variants.map((v: any) => v.hexCode);
    const uniqueHexCodes = [...new Set(hexCodes)];
    if (hexCodes.length !== uniqueHexCodes.length) {
      return NextResponse.json(
        { error: "Hex codes duplicados nas variantes" },
        { status: 400 }
      );
    }

    const [brandExists, categoriesExist] = await Promise.all([
      prisma.brand.findUnique({ where: { id: body.brandId } }),
      prisma.category.findMany({
        where: { id: { in: body.categoryIds } },
        select: { id: true }
      })
    ]);

    if (!brandExists) {
      return NextResponse.json(
        { error: "Marca não encontrada" },
        { status: 404 }
      );
    }

    if (categoriesExist.length !== body.categoryIds.length) {
      const invalidIds = body.categoryIds.filter(
        (id: string) => !categoriesExist.some(c => c.id === id)
      );
      return NextResponse.json(
        {
          error: "Categorias inválidas",
          invalidCategoryIds: invalidIds
        },
        { status: 400 }
      );
    }

    // 1. Upsert das cores FORA da transação
    const colorUpserts = body.variants.map((variant: any) =>
      prisma.color.upsert({
        where: { hexCode: variant.hexCode },
        create: { name: variant.name, hexCode: variant.hexCode },
        update: {}
      })
    );
    const colors = await Promise.all(colorUpserts);

    // 2. Prisma transaction só para o resto
    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          priceOld: body.priceOld,
          features: body.features,
          active: body.active ?? true,
          onSale: body.onSale ?? false,
          destaque: body.destaque ?? false,
          imagePrimary: body.imagePrimary,
          imagesSecondary: body.imagesSecondary || [],
          brandId: body.brandId,
          variants: {
            create: body.variants.map((variant: any, index: number) => ({
              colorId: colors[index].id,
              stock: {
                create: {
                  quantity: variant.quantity
                }
              }
            }))
          }
        },
        include: {
          variants: {
            include: {
              color: true,
              stock: true
            }
          }
        }
      });

      await tx.productCategory.createMany({
        data: body.categoryIds.map((categoryId: string) => ({
          productId: product.id,
          categoryId: categoryId
        }))
      });

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          variants: {
            include: {
              color: true,
              stock: true
            }
          },
          categories: {
            include: {
              category: true
            }
          },
          brand: true
        }
      });
    });

    return NextResponse.json(
      {
        message: "Produto criado com cores automaticamente",
        data: newProduct
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro na criação:", error);
    return NextResponse.json(
      {
        error: "Erro interno",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        ...(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
          ? { solution: "Hex code já existe para outra cor. Use um valor único." }
          : {}
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        imagePrimary: true,
        imagesSecondary: true,
        variants: { select: { id: true } }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const allImages = [
      product.imagePrimary,
      ...(product.imagesSecondary || [])
    ].filter(Boolean) as string[];

    for (const imageUrl of allImages) {
      const pathParts = imageUrl.split('/public/');
      if (pathParts.length === 2) {
        const [bucket, ...imagePath] = pathParts[1].split('/');
        const fileName = imagePath.join('/');
        const { error } = await supabase.storage
          .from(bucket)
          .remove([fileName]);
        
        if (error) console.error(`Erro ao excluir ${fileName}:`, error);
      }
    }

    await prisma.$transaction([

      prisma.orderItem.deleteMany({
        where: { 
          OR: [
            { productId: id },
            { productVariant: { productId: id } }
          ]
        }
      }),
      
      prisma.productCategory.deleteMany({ where: { productId: id } }),
      
      prisma.stock.deleteMany({
        where: { variantId: { in: product.variants.map(v => v.id) } }
      }),
      
      prisma.productVariant.deleteMany({ where: { productId: id } }),

      prisma.product.delete({ where: { id } })
    ]);

    const emptyOrders = await prisma.order.findMany({
      where: { items: { none: {} } }
    });

    if (emptyOrders.length > 0) {
      await prisma.order.deleteMany({
        where: { id: { in: emptyOrders.map(o => o.id) } }
      });
    }

    return NextResponse.json(
      { message: "Produto e todas as dependências excluídas com sucesso" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Erro na exclusão completa:", err);
    return NextResponse.json(
      { error: "Erro interno durante a exclusão total" },
      { status: 500 }
    );
  }
}

async function deleteImageFromSupabase(imageUrl: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const pathStart = imageUrl.indexOf('/storage/v1/object/public/');
  if (pathStart === -1) return;

  const path = imageUrl.substring(pathStart + '/storage/v1/object/public/'.length);
  const [bucket, ...rest] = path.split('/');
  const fileName = rest.join('/');

  const { error } = await supabase.storage.from(bucket).remove([fileName]);
  if (error) console.error(`Erro ao excluir ${fileName}:`, error);
}

export async function PUT(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const requiredFields = ['id', 'name', 'description', 'price', 'brandId', 'categoryIds', 'features'];
    if (requiredFields.some(field => !body[field])) {
      return NextResponse.json(
        { error: `Campos obrigatórios: ${requiredFields.join(', ')}` },
        { status: 400 }
      );
    }

    const colorUpserts = body.variants.map((variant: any) =>
      prisma.color.upsert({
        where: { hexCode: variant.hexCode },
        create: { name: variant.name, hexCode: variant.hexCode },
        update: { name: variant.name }
      })
    );
    const updatedColors = await Promise.all(colorUpserts);

    const updatedProduct = await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { id: body.id },
        include: {
          variants: {
            include: {
              color: true,
              stock: true
            }
          },
          categories: true
        }
      });

      if (!existingProduct) throw new Error("Produto não encontrado");

      const existingVariantsMap = new Map(
        existingProduct.variants.map(v => [v.color.hexCode, v])
      );

      for (const [index, variantData] of body.variants.entries()) {
        const color = updatedColors[index];
        const existingVariant = existingVariantsMap.get(color.hexCode);

        if (existingVariant) {
          await tx.stock.update({
            where: { variantId: existingVariant.id },
            data: { quantity: variantData.quantity }
          });
        } else {
          const newVariant = await tx.productVariant.create({
            data: {
              colorId: color.id,
              productId: body.id
            }
          });
          await tx.stock.create({
            data: {
              variantId: newVariant.id,
              quantity: variantData.quantity
            }
          });
        }
      }

      const incomingHexCodes = new Set(body.variants.map((v: any) => v.hexCode));
      for (const existingVariant of existingProduct.variants) {
        if (!incomingHexCodes.has(existingVariant.color.hexCode)) {
          const hasAssociatedOrders = await tx.orderItem.count({
            where: { productVariantId: existingVariant.id }
          }) > 0;

          if (!hasAssociatedOrders) {
            await tx.stock.deleteMany({
              where: { variantId: existingVariant.id }
            });
            await tx.productVariant.delete({
              where: { id: existingVariant.id }
            });
          }
        }
      }

      const updatedProd = await tx.product.update({
        where: { id: body.id },
        data: {
          name: body.name,
          description: body.description,
          price: body.price,
          priceOld: body.priceOld || null,
          features: body.features,
          onSale: body.onSale ?? false,
          active: body.active ?? true,
          destaque: body.destaque ?? false,
          imagePrimary: body.imagePrimary || null,
          imagesSecondary: Array.isArray(body.imagesSecondary) 
            ? body.imagesSecondary 
            : [],
          brand: { connect: { id: body.brandId } },
        },
        include: { 
          variants: { include: { color: true, stock: true } }, 
          categories: { include: { category: true } } 
        }
      });

      const existingCategoryIds = existingProduct.categories.map(c => c.categoryId);
      const categoriesToAdd = body.categoryIds.filter((id: string) => 
        !existingCategoryIds.includes(id)
      );
      const categoriesToRemove = existingCategoryIds.filter(id => 
        !body.categoryIds.includes(id)
      );

      if (categoriesToRemove.length > 0) {
        await tx.productCategory.deleteMany({
          where: { 
            productId: body.id, 
            categoryId: { in: categoriesToRemove.filter((id: string | null) => id !== null) as string[] }
          }
        });
      }

      if (categoriesToAdd.length > 0) {
        await tx.productCategory.createMany({
          data: categoriesToAdd.map((categoryId: string) => ({
            productId: body.id,
            categoryId
          }))
        });
      }

      return tx.product.findUnique({
        where: { id: body.id },
        include: { 
          variants: { include: { color: true, stock: true } }, 
          categories: { include: { category: true } } 
        }
      });
    });

    const originalImages = [
      updatedProduct?.imagePrimary,
      ...(updatedProduct?.imagesSecondary || [])
    ].filter(Boolean) as string[];

    const newImages = [
      body.imagePrimary,
      ...(Array.isArray(body.imagesSecondary) ? body.imagesSecondary : [])
    ].filter(Boolean) as string[];

    const imagesToDelete = originalImages.filter(img => !newImages.includes(img));
    for (const imgUrl of imagesToDelete) {
      await deleteImageFromSupabase(imgUrl);
    }

    return NextResponse.json(
      { message: "Produto atualizado com sucesso", data: updatedProduct },
      { status: 200 }
    );

  } catch (err) {
    console.error("Erro ao atualizar produto:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    );
  }
}