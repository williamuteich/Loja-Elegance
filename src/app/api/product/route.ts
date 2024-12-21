import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { error } from "console";

const prisma = new PrismaClient();

//export async function GET() {
//    return NextResponse.json({
//        hello: "world"
//    })
//}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if(!body.name || !body.description || !body.price)  {
            return NextResponse.json({ error: 'name, description and price are required' }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                imageUrl: body.imageUrl || null,
                active: body.active !== undefined ? body.active : true,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
        
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}