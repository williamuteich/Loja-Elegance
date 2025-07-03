import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const pickupLocations = await prisma.deliveryOption.findMany();

        console.log("consumindo")
        return NextResponse.json({ pickupLocations }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json(); 
        const { title, description, category } = body;

        if (!title || !description || !category) {
            return NextResponse.json({ message: 'Title, description, and category are required' }, { status: 400 });
        }

        const validCategories = ['Retiro en tienda', 'Otras opciones'];
        if (!validCategories.includes(category)) {
            return NextResponse.json({ message: 'Invalid category. Use "Retiro en tienda" or "Otras opciones"' }, { status: 400 });
        }
        const newDeliveryOption = await prisma.deliveryOption.create({
            data: {
                title: title,
                description: description,
                category: category
            }
        });

        return NextResponse.json({
            message: 'Delivery option created successfully',
            deliveryOption: newDeliveryOption
        }, { status: 201 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json(); 
        const { id, title, description, category } = body;

        if (!id || !title || !description || !category) {
            return NextResponse.json({ message: 'ID, title, description, and category are required' }, { status: 400 });
        }

        const validCategories = ['Retiro en tienda', 'Otras opciones'];
        if (!validCategories.includes(category)) {
            return NextResponse.json({ message: 'Invalid category. Use "Retiro en tienda" or "Otras opciones"' }, { status: 400 });
        }

        const updatedDeliveryOption = await prisma.deliveryOption.update({
            where: { id: id },
            data: {
                title: title,
                description: description,
                category: category
            }
        });

        return NextResponse.json({
            message: 'Delivery option updated successfully',
            deliveryOption: updatedDeliveryOption
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {

    const authError = await requireAdmin(request);
    if (authError) {
        return authError;
    }

    try {
        const body = await request.json(); 
        const { id } = body;

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        await prisma.deliveryOption.delete({
            where: { id: id }  
        });

        return NextResponse.json({
            message: 'Delivery option deleted successfully'
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
