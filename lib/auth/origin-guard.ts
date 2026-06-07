import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set(['https://lanzoor.dev', 'https://www.lanzoor.dev']);

export function checkOrigin(req: NextRequest, allowedOrigins: Set<string> = ALLOWED_ORIGINS): NextResponse | null {
    const origin = req.headers.get('origin');

    if (!origin) {
        return NextResponse.json(
            { error: 'Origin header is required' },
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    if (allowedOrigins.has(origin)) {
        return null;
    }

    return NextResponse.json(
        { error: 'Unauthorized origin' },
        {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
