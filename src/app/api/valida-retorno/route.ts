import { NextResponse } from 'next/server';
import { createHmac, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('preferenceId');
    const paymentId = searchParams.get('paymentId');
    const merchantOrderId = searchParams.get('merchantOrderId');

    if (!preferenceId || !paymentId || !merchantOrderId) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Validate the payment
    const isValid = await validatePayment(preferenceId, paymentId, merchantOrderId);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid payment' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}