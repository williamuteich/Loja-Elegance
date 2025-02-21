import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const getParam = url.searchParams.get('userID');
        
        if (!getParam || getParam === '') {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const getAddresses = await prisma.user.findFirst({
            where: { id: getParam || undefined },
            select: {
                name: true,
                email: true,
                telefone: true,
                enderecos: {
                    select: {
                        cep: true,
                        logradouro: true,
                        numero: true,
                        complemento: true,
                        bairro: true,
                        cidade: true,
                        estado: true,
                        pais: true
                    }
                }
            }
        });

        return NextResponse.json(getAddresses, { status: 200 });

    } catch (err) {
        console.error("Erro no filtro de status", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const {
            userID,
            name,
            email,
            telefone,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            pais
        } = await request.json();

        console.log("recebendo dados", { userID, name, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, pais });

        if (!userID || !name || !email || !cep || !logradouro || !numero || !bairro || !cidade || !estado || !pais) {
            return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true, 
                role: true,
                active: true,
                enderecos: true, 
                telefone: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

                await prisma.user.update({
            where: { id: userID },
            data: {
                name,  
                email, 
                telefone 
            }
        });

        if (user.enderecos && user.enderecos.length > 0) {
            const updatedAddress = await prisma.endereco.update({
                where: { id: user.enderecos[0].id }, 
                data: {
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    pais
                }
            });
            return NextResponse.json({ ...user, updatedAddress }, { status: 200 });
        } else {
            const newAddress = await prisma.endereco.create({
                data: {
                    userId: user.id, 
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    pais
                }
            });
            return NextResponse.json({ ...user, newAddress }, { status: 200 });
        }

    } catch (err) {
        console.error("Erro no filtro de status", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
