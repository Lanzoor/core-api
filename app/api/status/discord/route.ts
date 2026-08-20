import { NextRequest, NextResponse } from 'next/server';
import { corsJson, corsResponse, debugRequest, handleErrors } from '@/lib/api';
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

        const userId = '1160164047111606292';
        const lanyardURL = `https://api.lanyard.rest/v1/users/${userId}`;

        console.log(`Fetching from URL ${lanyardURL}`);

        const response = await fetch(lanyardURL);
        const data = await response.json();

        if (data.success === false && data.error) {
            throw new Error(`Lanyard API Error: ${data.error.message || 'Unknown error'}`);
        }

        const body = {
            time: Date.now(),
            data: data.data,
        };

        return corsJson({ success: true, data: body }, { status: 200 });
    } catch (error: any) {
        return handleErrors(error);
    }
}
