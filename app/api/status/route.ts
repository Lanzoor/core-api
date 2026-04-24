import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

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

        const projectId = process.env.VERCEL_PROJECT_ID;
        const token = process.env.VERCEL_TOKEN;

        const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        const latest = data.deployments?.[0];

        const body = {
            ok: true,
            message: 'Servers online! Pong 🏓',
            time: Date.now(),
            lastUpdated: latest?.createdAt ?? null,
            vercelUrl: latest?.url ?? null,
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORS_HEADERS,
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                ok: false,
                error: err.message,
            },
            {
                status: 400,
                headers: CORS_HEADERS,
            }
        );
    }
}
