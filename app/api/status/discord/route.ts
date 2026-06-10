import { NextRequest, NextResponse } from 'next/server';
import { handleOptions, handleErrors, debugRequest, CORSHeadersAllowAll } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';

export async function OPTIONS() {
    return handleOptions(CORSHeadersAllowAll);
}

export async function GET(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const userId = '1160164047111606292';
        const lanyardURL = `https://api.lanyard.rest/v1/users/${userId}`;

        console.log(`Fetching from URL ${lanyardURL}`);

        const response = await fetch(lanyardURL);
        const data = await response.json();

        if (data.success === false && data.error) {
            throw new Error(`Lanyard API Error: ${data.error.message || 'Unknown error'}`);
        }

        const body = {
            ok: true,
            time: Date.now(),
            data: data.data,
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORSHeadersAllowAll,
        });
    } catch (error: any) {
        return handleErrors(error);
    }
}
