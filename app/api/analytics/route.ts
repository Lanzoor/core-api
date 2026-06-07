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

        const body = await req.json();

        const originError = checkOrigin(req);
        if (originError) {
            return originError;
        }

        const rateLimitResponse = await rateLimit(req);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        const PATH_LENGTH_LIMIT = 250;
        const rawPath = body.path;
        if (typeof rawPath !== 'string') {
            throw new Error('Invalid path, excluding from analytics.');
        }
        let path = rawPath.trim();
        path = path.split('?')[0].split('#')[0];
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        try {
            path = decodeURIComponent(path);
        } catch {
            console.warn('Failed to decode URL component, fallback to original string.');
        }
        path = path
            .replace(/\/+/g, '/')
            .replace(/[^A-Za-z0-9_/-]/g, '')
            .replace(/\.\./g, '')
            .replace(/^\.+/, '')
            .replace(/\/+\./g, '/')
            .trim();
        if (path.length > PATH_LENGTH_LIMIT || path === '') {
            throw new Error('Invalid or abnormally long path, excluding from analytics.');
        }

        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');

        const hostname = origin ? new URL(origin).hostname : referer ? new URL(referer).hostname : '';

        const trustedHostnames = new Set(['lanzoor.dev', 'www.lanzoor.dev']);
        const isTrustedOrigin = trustedHostnames.has(hostname);

        if (!isTrustedOrigin) {
            throw new Error('Untrusted origin detected, excluding from analytics.');
        }

        const userAgent = (req.headers.get('user-agent') ?? '').toLowerCase();
        const botKeywords = ['bot', 'crawler', 'spider', 'ahrefs', 'semrush', 'mj12bot', 'rogerbot', 'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandex', 'facebot', 'twitterbot', 'rogerbot', 'applebot', 'linkedinbot'];

        const isLikelyBotByName = botKeywords.some((keyword) => userAgent.includes(keyword));
        const isLikelyBotByLength = userAgent.length >= 400;

        if (isLikelyBotByName || isLikelyBotByLength) {
            throw new Error('The user-agent is likely a bot, excluding from analytics.');
        }

        const rawCountry: string | null = req.headers.get('x-vercel-ip-country');
        let country: string = 'Unknown';

        if (typeof rawCountry === 'string') {
            const trimmed = rawCountry.trim().toUpperCase();

            if (/^[A-Z]{2}$/.test(trimmed)) {
                country = trimmed;
            }
        }

        // const validCountries = new Set(['US', 'JP', 'KR', 'DE', 'FR' /* ... */]);
        // if (!validCountries.has(country)) {
        //     country = 'Unknown';
        // }

        const rawReferrer = req.headers.get('referer');

        let referrer = 'Unknown';

        if (typeof rawReferrer === 'string' && rawReferrer.length > 0) {
            try {
                const url = new URL(rawReferrer);

                referrer = url.hostname + url.pathname;

                if (referrer.length > PATH_LENGTH_LIMIT) {
                    referrer = 'Invalid';
                }
            } catch {
                referrer = 'Invalid';
            }
        }

        const timestamp = Date.now();

        const analytics = {
            path,
            country,
            timestamp,
            referrer,
        };

        await CoreAnalyticsDB.execute({
            sql: `
        INSERT INTO visits (path, country, timestamp, referrer)
        VALUES (?, ?, ?, ?)
    `,
            args: [analytics.path, analytics.country, analytics.timestamp, analytics.referrer],
        });

        return NextResponse.json(analytics);
    } catch (error: any) {
        return handleErrors(error, 204);
    }
}
