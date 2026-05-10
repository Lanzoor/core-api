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
                frontend: 'v26.20.2',
                backend: 'v26.1.6',
            },
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORSHeadersAllowAll,
        });
    } catch (err: any) {
        return handleErrors(err);
    }
}
