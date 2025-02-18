import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.code || !body.total || !body.product_ids) {
            return new NextResponse(
                JSON.stringify({ message: 'Code, total, and product_ids are required' }),
                { status: 400 }
            );
        }

        const validationResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const validationResult = await validationResponse.json();

        if (validationResponse.status !== 200) {
            return new NextResponse(JSON.stringify({ message: validationResult.message }), { status: validationResponse.status });
        }

        const cupom = validationResult.coupon;
        let novoTotal = body.total;

        if (cupom.type === 'percentual') {
            novoTotal -= novoTotal * (cupom.value / 100);
        } else if (cupom.type === 'fixo') {
            novoTotal -= cupom.value;
        }

        return new NextResponse(
            JSON.stringify({ message: 'Discount applied successfully', novoTotal }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error applying discount:", err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return new NextResponse(
            JSON.stringify({ error: 'Internal server error', details: errorMessage }),
            { status: 500 }
        );
    }
}
