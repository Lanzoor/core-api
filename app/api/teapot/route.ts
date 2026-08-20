import { NextRequest, NextResponse } from 'next/server';
import { corsJson, corsResponse, debugRequest, handleErrors } from '@/lib/api';
import { rateLimit, rateLimits } from '@/lib/rate-limit';

export async function OPTIONS() {
    return corsResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req, rateLimits.lenient);

        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        return corsJson(
            {
                success: true,
                data: { message: 'I am permanently a teapot. I refuse to brew coffee.' },
            },
            {
                status: 418,
            }
        );
    } catch (error: any) {
        return handleErrors(error);
    }
}
