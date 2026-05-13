import { NextRequest, NextResponse } from 'next/server';
import { handleOptions, handleErrors } from '@/lib/api';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://www.lanzoor.dev',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return handleOptions(CORS_HEADERS);
}

export async function GET(req: NextRequest) {
    try {
        console.log('Ping invoked!', {
            method: req.method,
            url: req.url,
        });

        const userId = process.env.NEXT_PUBLIC_DISCORD_USER_ID;
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
            headers: CORS_HEADERS,
        });
    } catch (error: any) {
        return handleErrors(error);
    }
}
