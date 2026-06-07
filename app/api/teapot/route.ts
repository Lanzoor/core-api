import { NextRequest, NextResponse } from 'next/server';
import { CORSHeadersAllowAll, handleOptions, handleErrors, debugRequest } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        return NextResponse.json(
            {
                ok: true,
                message: 'I am permanently a teapot. I refuse to brew coffee.',
            },
            {
                status: 418,
                headers: CORSHeadersAllowAll,
            }
        );
    } catch (error: any) {
        return handleErrors(error);
    }
}
