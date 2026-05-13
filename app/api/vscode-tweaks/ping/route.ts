import { NextRequest, NextResponse } from 'next/server';
import { CORSHeadersAllowAll, handleOptions, handleErrors } from '@/lib/api';

export async function OPTIONS() {
    return handleOptions();
}

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
                headers: CORSHeadersAllowAll,
            }
        );
    } catch (error: any) {
        return handleErrors(error);
    }
}
