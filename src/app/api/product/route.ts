import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const products = await prisma.product.findMany({
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

        return NextResponse.json(products, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (
            !body.name || 
            !body.description || 
            !body.price || 
            !body.brandId || 
            !body.categoryIds || 
            typeof body.quantity !== "number"
        ) {
            return NextResponse.json(
                { error: "name, description, price, brandId, categoryIds, and quantity are required" }, 
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

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                imageUrl: body.imageUrl || null,
                active: body.active !== undefined ? body.active : true,
                brand: { connect: { id: body.brandId } },
                stock: {
                    create: {
                        quantity: body.quantity,
                    },
                },
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
