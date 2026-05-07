import { NextRequest, NextResponse } from 'next/server';
import { CORSHeadersAllowAll, handleOptions, handleErrors } from '@/lib/api';

export async function OPTIONS() {
    return handleOptions();
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
            message: 'pong 🏓',
            time: Date.now(),
            lastUpdated: latest?.createdAt ?? null,
            vercelUrl: latest?.url ?? null,
            versions: {
                frontend: 'v26.19.7.1',
                backend: 'v26.1.4',
            },
        };

        return NextResponse.json(body, {
            status: 200,
            headers: CORSHeadersAllowAll,
        });
    } catch (err: any) {
        return handleErrors(err);
    }
}
