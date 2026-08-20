import { NextRequest, NextResponse } from 'next/server';
import { coreVersions, debugRequest, corsJson, handleErrors, corsResponse } from '@/lib/api';
import { rateLimit, rateLimits } from '@/lib/rate-limit';

export async function OPTIONS() {
    return corsResponse(null, { status: 204 });
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
            message: 'pong 🏓',
            time: Date.now(),
            lastUpdated,
            versions: coreVersions,
        };

        return corsJson({ success: true, data: body }, { status: 200 });
    } catch (error: any) {
        return handleErrors(error);
    }
}
