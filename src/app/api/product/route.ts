import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (
            !body.name || 
            !body.description || 
            !body.price || 
            !body.brandId || 
            !body.categoryId || 
            typeof body.quantity !== "number"
        ) {
            return NextResponse.json(
                { error: "name, description, price, brandId, categoryId, and quantity are required" }, 
                { status: 400 }
            );
        }


        const brandExists = await prisma.brand.findUnique({
            where: { id: body.brandId },
        });

        const categoryExists = await prisma.category.findUnique({
            where: { id: body.categoryId },
        });

        if (!brandExists || !categoryExists) {
            return NextResponse.json({ error: "Invalid brandId or categoryId" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                imageUrl: body.imageUrl || null,
                active: body.active !== undefined ? body.active : true,
                brand: { connect: { id: body.brandId } },
                category: { connect: { id: body.categoryId } },
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

        return NextResponse.json(newProduct, { status: 201 });

    } catch (err) {
        console.error("Erro ao criar produto:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
