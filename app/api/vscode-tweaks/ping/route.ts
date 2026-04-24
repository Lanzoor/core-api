import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

async function pingUrl(url: string) {
    try {
        const start = performance.now();

        await fetch(url, {
            method: 'HEAD',
        });

        const end = performance.now();

        return `${(end - start).toFixed(2)}ms`;
    } catch {
        return 'unreachable';
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: CORS_HEADERS,
    });
}

export async function GET(req: NextRequest) {
    try {
        console.log('Ping invoked!', {
            method: req.method,
            url: req.url,
        });

        const githubPing = await pingUrl('https://github.com');
        const googlePing = await pingUrl('https://google.com');
        const selfPing = await pingUrl('https://api.lanzoor.dev/api/status');

        return NextResponse.json(
            {
                ok: true,
                githubPing,
                googlePing,
                selfPing,
            },
            {
                status: 200,
                headers: CORS_HEADERS,
            }
        );
    } catch (err: any) {
        return NextResponse.json(
            {
                ok: false,
                error: err.message,
            },
            {
                status: 500,
                headers: CORS_HEADERS,
            }
        );
    }
}
