import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

export async function GET(request: Request) {
    try {
        const pickupLocations = await prisma.deliveryOption.findMany();

        return NextResponse.json({ pickupLocations }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json(); 
        const { id, title, description, category } = body;

        // Verificar se todos os dados necessários foram fornecidos
        if (!id || !title || !description || !category) {
            return NextResponse.json({ message: 'ID, title, description, and category are required' }, { status: 400 });
        }

        // Validar categoria
        const validCategories = ['Retiro en tienda', 'Otras opciones'];
        if (!validCategories.includes(category)) {
            return NextResponse.json({ message: 'Invalid category. Use "Retiro en tienda" or "Otras opciones"' }, { status: 400 });
        }

        // Atualizar a opção de entrega no banco de dados (MongoDB)
        const updatedDeliveryOption = await prisma.deliveryOption.update({
            where: { id: id },  // id é uma String (ObjectId)
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
    try {
        const body = await request.json(); 
        const { id } = body;

        // Verificar se o ID foi fornecido
        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        // Excluir a opção de entrega no banco de dados (MongoDB)
        await prisma.deliveryOption.delete({
            where: { id: id }  // id é uma String (ObjectId)
        });

        return NextResponse.json({
            message: 'Delivery option deleted successfully'
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
