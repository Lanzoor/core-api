import { NextRequest, NextResponse } from 'next/server';
import { coreVersions, CORSHeadersAllowAll, handleOptions, handleErrors, debugRequest } from '@/lib/api';
import { CoreAnalyticsDB } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { checkOrigin } from '@/lib/auth/origin-guard';

export async function OPTIONS() {
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req);
        if (rateLimitResponse) return rateLimitResponse;

        const originError = checkOrigin(req);
        if (originError) return originError;

        const clientSecret = req.headers.get('x-client-secret');
        if (clientSecret !== process.env.NEXT_PUBLIC_ANALYTICS_SECRET) {
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 403 });
        }

        const body = await req.json();

        const PATH_LENGTH_LIMIT = 250;
        const rawPath = body.path;

        if (typeof rawPath !== 'string') {
            throw new Error('Invalid path');
        }

        let path = rawPath.trim().split('?')[0].split('#')[0];

        if (!path.startsWith('/')) path = '/' + path;

        try {
            path = decodeURIComponent(path);
        } catch {}

        path = path
            .replace(/\/+/g, '/')
            .replace(/[^A-Za-z0-9_/-]/g, '')
            .replace(/\.\./g, '')
            .replace(/^\.+/, '')
            .replace(/\/+\./g, '/')
            .trim();

        if (path.length > PATH_LENGTH_LIMIT || path === '') {
            throw new Error('Invalid or abnormally long path');
        }

        const userAgent = (req.headers.get('user-agent') ?? '').toLowerCase();
        const botKeywords = ['bot', 'crawler', 'spider', 'ahrefs', 'semrush', 'googlebot', 'bingbot', 'slurp'];

        if (botKeywords.some((keyword) => userAgent.includes(keyword)) || userAgent.length >= 400) {
            throw new Error('Bot detected');
        }

        const rawCountry = req.headers.get('x-vercel-ip-country');
        const country = typeof rawCountry === 'string' && /^[A-Z]{2}$/.test(rawCountry.trim().toUpperCase()) ? rawCountry.trim().toUpperCase() : 'Unknown';

        let referrer = 'Unknown';
        const rawReferrer = req.headers.get('referer');
        if (rawReferrer) {
            try {
                const url = new URL(rawReferrer);
                referrer = (url.hostname + url.pathname).slice(0, 300);
            } catch {}
        }

        const timestamp = Date.now();

        await CoreAnalyticsDB.execute({
            sql: `
                INSERT INTO visits (path, country, timestamp, referrer)
                VALUES (?, ?, ?, ?)
            `,
            args: [path, country, timestamp, referrer],
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return handleErrors(error, 204);
    }
}
