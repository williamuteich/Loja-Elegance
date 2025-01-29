import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status");
    const id = url.searchParams.get('id');
    const pageSize = 10;

    let products;


    if(id) {
      products = await prisma.product.findUnique({ where: { id } }
        
      );
      console.log(products)
      if (!products) {
          return NextResponse.json({ error: 'Formulário não encontrado' }, { status: 404 });
      }
    }else{

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
    products = await prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        brand: true,
        categories: {
          include: {
            category: true,
          },
        },
        stock: true,
      },
    });
    }

    const totalRecords = await prisma.product.count({});

    return NextResponse.json({ produtos: products, totalRecords }, { status: 200 });
  } catch (err) {
    console.error("Erro no filtro de status", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body)
    console.log(body);
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
        onSale: body.onSale !== undefined ? body.onSale : true,
        active: body.active !== undefined ? body.active : true,
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
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.productCategory.deleteMany({
      where: { productId: id }
    });

    await prisma.stock.deleteMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product and related data deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
