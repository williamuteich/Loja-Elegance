import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

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

    let products;
    const baseInclude = {
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      stock: true,
      reservations: {
        where: {
          expiresAt: { gt: new Date() }
        }
      },
    };

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

      if (fetchAll) {
        products = await prisma.product.findMany({
          where,
          include: baseInclude,
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        products = await prisma.product.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: baseInclude,
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    }

    const processProductStock = (product: any) => ({
      ...product,
      availableStock: Math.max(
        (product.stock?.quantity || 0) -
        product.reservations.reduce((sum: number, r: any) => sum + r.quantity, 0),
        0
      )
    });

    const processedProducts = products
      ? Array.isArray(products)
        ? products.map(processProductStock)
        : processProductStock(products)
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
      totalRecords
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
  try {
    const body = await request.json();

    if (
      !body.name ||
      !body.description ||
      !body.brandId ||
      !body.features ||
      !body.categoryIds ||
      typeof body.quantity !== "number"
    ) {
      return NextResponse.json(
        { error: "name, description, price, brandId, categoryIds, features and quantity are required" },
        { status: 400 }
      );
    }

    const brandExists = await prisma.brand.findUnique({
      where: { id: body.brandId },
    });

    if (!brandExists) {
      return NextResponse.json({ error: "Invalid brandId" }, { status: 400 });
    }

    const categoriesExist = await prisma.category.findMany({
      where: {
        id: { in: body.categoryIds },
      },
    });

    if (categoriesExist.length !== body.categoryIds.length) {
      return NextResponse.json({ error: "One or more categoryIds are invalid" }, { status: 400 });
    }

    const imagePrimary = body.uploadedImageUrls[0];
    const imagesSecondary = body.uploadedImageUrls.slice(1);

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        features: body.features,
        price: body.price,
        priceOld: body.priceOld || null,
        onSale: body.onSale ?? false,
        destaque: body.destaque ?? false,
        active: body.active ?? false,
        brand: { connect: { id: body.brandId } },
        stock: {
          create: {
            quantity: body.quantity,
          },
        },
        imagePrimary: imagePrimary,
        imagesSecondary: imagesSecondary,
      },
      include: {
        stock: true,
      },
    });

    await prisma.productCategory.createMany({
      data: body.categoryIds.map((categoryId: string) => ({
        productId: newProduct.id,
        categoryId: categoryId,
      })),
    });

    return NextResponse.json({ message: "Product created", data: newProduct }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.id ||
      !body.name ||
      !body.description ||
      !body.brandId ||
      !body.features ||
      !body.categoryIds ||
      typeof body.quantity !== 'number' ||
      typeof body.price !== 'number'
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios: id, name, description, price, brandId, categoryIds, features e quantity" },
        { status: 400 }
      );
    }

    const productExists = await prisma.product.findUnique({
      where: { id: body.id },
      include: { stock: true },
    });

    if (!productExists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const brandExists = await prisma.brand.findUnique({
      where: { id: body.brandId },
    });
    if (!brandExists) {
      return NextResponse.json({ error: "Marca inválida" }, { status: 400 });
    }

    const categoriesExist = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
    });
    if (categoriesExist.length !== body.categoryIds.length) {
      return NextResponse.json({ error: "Categorias inválidas" }, { status: 400 });
    }

    const newImagePrimary = body.imagePrimary || null;
    const newImagesSecondary = Array.isArray(body.imagesSecondary) ? body.imagesSecondary : [];

    const updatedProduct = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        features: body.features,
        price: body.price,
        priceOld: body.priceOld || null,
        onSale: body.onSale ?? true,
        active: body.active ?? true,
        brand: { connect: { id: body.brandId } },
        stock: {
          update: { quantity: body.quantity }
        },
        imagePrimary: newImagePrimary,
        imagesSecondary: newImagesSecondary,
      },
      include: { stock: true },
    });

    const existingImages = [
      productExists.imagePrimary,
      ...productExists.imagesSecondary
    ].filter(Boolean);

    const newImages = [
      newImagePrimary,
      ...newImagesSecondary
    ].filter(Boolean);

    const imagesToDelete = existingImages.filter(img => !newImages.includes(img));

    if (imagesToDelete.length > 0) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      for (const imageUrl of imagesToDelete) {
        const pathParts = imageUrl ? imageUrl.split('/public/') : [];
        if (pathParts.length === 2) {
          const [bucket, ...imagePath] = pathParts[1].split('/');
          const fileName = imagePath.join('/');

          const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

          if (error) {
            console.error(`Erro ao excluir ${fileName}:`, error);
          }
        }
      }
    }

    const existingCategories = await prisma.productCategory.findMany({
      where: { productId: body.id },
    });

    const existingCategoryIds = existingCategories.map(c => c.categoryId);
    const categoriesToAdd = body.categoryIds.filter((id: string) => !existingCategoryIds.includes(id));
    const categoriesToRemove = existingCategoryIds.filter(id => !body.categoryIds.includes(id));

    if (categoriesToRemove.length > 0) {
      await prisma.productCategory.deleteMany({
        where: {
          productId: body.id,
          categoryId: { in: categoriesToRemove }
        }
      });
    }

    if (categoriesToAdd.length > 0) {
      await prisma.productCategory.createMany({
        data: categoriesToAdd.map((categoryId: string) => ({
          productId: body.id,
          categoryId
        }))
      });
    }

    return NextResponse.json(
      { message: "Produto atualizado", data: updatedProduct },
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


export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const productExists = await prisma.product.findUnique({
      where: { id }
    });

    if (!productExists) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Excluir imagens do Supabase
    const images = [productExists.imagePrimary, ...productExists.imagesSecondary];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    for (const imageUrl of images) {
      if (!imageUrl) continue;
      const pathParts = imageUrl.split('/public/');
      if (pathParts.length === 2) {
        const [bucket, ...imagePath] = pathParts[1].split('/');
        const fileName = imagePath.join('/');
        const { error } = await supabase.storage.from(bucket).remove([fileName]);

        if (error) {
          console.error(`Erro ao excluir ${fileName}:`, error);
        }
      }
    }

    // Remover relacionamentos
    await prisma.productCategory.deleteMany({ where: { productId: id } });
    await prisma.stock.deleteMany({ where: { productId: id } });

    // Excluir produto
    await prisma.product.delete({ where: { id } });

    return NextResponse.json(
      { message: "Produto e dados relacionados excluídos com sucesso" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro ao excluir produto:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
