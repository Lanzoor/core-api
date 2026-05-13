import { NextRequest, NextResponse } from 'next/server';
import { CORSHeadersAllowAll, handleOptions, handleErrors } from '@/lib/api';

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(req: NextRequest) {
    try {
        console.log('Ping invoked!', {
            method: req.method,
            url: req.url,
        });

        const raw = process.env.NEXT_PUBLIC_BUILD_DATE;
        const lastUpdated: number | null = raw ? parseInt(raw) || null : null;

        const body = {
            ok: true,
            message: 'pong 🏓',
            time: Date.now(),
            lastUpdated,
            versions: {
                frontend: 'v26.20.5',
                backend: 'v26.1.7',
            },
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORSHeadersAllowAll,
        });
    } catch (error: any) {
        return handleErrors(error);
    }
}
