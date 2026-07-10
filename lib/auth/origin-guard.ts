import { NextRequest, NextResponse } from 'next/server';
import { corsJson } from '../api';

const ALLOWED_ORIGINS = new Set(['https://lanzoor.dev', 'https://www.lanzoor.dev']);

export function checkOrigin(
    req: NextRequest,
    allowedOrigins: Set<string> = ALLOWED_ORIGINS
): NextResponse | null {
    const origin = req.headers.get('origin');

    if (!origin) {
        console.log('origin limited');
        return corsJson(
            {
                success: false,
                body: {
                    error: 'Origin header is required',
                },
            },
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    if (allowedOrigins.has(origin)) {
        return null;
    }

    console.log('origin limited');
    return NextResponse.json(
        { error: 'Unauthorized origin' },
        {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
