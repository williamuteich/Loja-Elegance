import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface dadosDataProps {
    id: number;
    name: string;
    value: string;
    url: string;
    type: string;
}

interface configDataProps {
    socialMedia: dadosDataProps[];  
    contacts: dadosDataProps[];      
}

export async function GET(request: Request) {
    try {
        const config = await prisma.config.findFirst({
            include: {
                socialMedia: true,
                contacts: true,
            },
        });

        return NextResponse.json(config, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const configData = {
            socialMedia: {
                create: body.socialMedia ? body.socialMedia.map((social: dadosDataProps) => ({
                    name: social.name,
                    url: social.url, // Corrigido para 'url' no mapeamento
                })) : [],
            },
            contacts: {
                create: body.contacts ? body.contacts.map((contact: dadosDataProps) => ({
                    type: contact.type, // Corrigido para 'type' no mapeamento
                    value: contact.value,
                })) : [],
            },
        };

        await prisma.config.create({
            data: configData,
        });

        return NextResponse.json(configData, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const config = await prisma.config.findUnique({
            where: { id: body.id },
        });

        if (!config) {
            return NextResponse.json({ error: 'Config record not found' }, { status: 404 });
        }

        if (body.socialMedia && Array.isArray(body.socialMedia)) {
            for (const social of body.socialMedia) {
                if (social.id) {
                    await prisma.socialMedia.update({
                        where: { id: social.id },  
                        data: {
                            name: social.name,
                            url: social.url,
                        },
                    });
                }
            }
        }

        if (body.contacts && Array.isArray(body.contacts)) {
            for (const contact of body.contacts) {
                if (contact.id) {
                    await prisma.contact.update({
                        where: { id: contact.id },  
                        data: {
                            type: contact.type,
                            value: contact.value,
                        },
                    });
                }
            }
        }

        return NextResponse.json({ message: 'Records updated successfully' }, { status: 200 });

    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (body.contacts && Array.isArray(body.contacts)) {
            for (const contact of body.contacts) {
                if (contact.id) {
                    await prisma.contact.delete({
                        where: { id: contact.id },
                    });
                }
            }
        }

        if (body.socialMedia && Array.isArray(body.socialMedia)) {
            for (const social of body.socialMedia) {
                if (social.id) {
                    await prisma.socialMedia.delete({
                        where: { id: social.id },
                    });
                }
            }
        }

        return NextResponse.json({ message: 'Records deleted successfully' }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
