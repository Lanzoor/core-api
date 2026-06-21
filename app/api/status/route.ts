import { NextRequest, NextResponse } from 'next/server';
import { coreVersions, CORSHeadersAllowAll, handleOptions, handleErrors, debugRequest } from '@/lib/api';
import { rateLimit, rateLimits } from '@/lib/rate-limit';

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req, rateLimits.normal);

        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const raw = process.env.NEXT_PUBLIC_BUILD_DATE;
        const lastUpdated: number | null = raw ? parseInt(raw) || null : null;

        const body = {
            ok: true,
            message: 'pong 🏓',
            time: Date.now(),
            lastUpdated,
            versions: coreVersions,
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORSHeadersAllowAll,
        });
    } catch (error: any) {
        return handleErrors(error);
    }
}
