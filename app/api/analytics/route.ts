import { NextRequest, NextResponse } from 'next/server';
import { handleOptions, handleErrors, debugRequest } from '@/lib/api';
import { CoreDB } from '@/lib/database';
import { rateLimit, rateLimits } from '@/lib/rate-limit';
import { normalizeDirectoryPath } from '@/lib/security';
import { checkOrigin } from '@/lib/auth/origin-guard';

export async function OPTIONS() {
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        debugRequest(req);

        const rateLimitResponse = await rateLimit(req, rateLimits.normal);

        if (rateLimitResponse) return rateLimitResponse;

        const originError = checkOrigin(req);
        if (originError) return originError;

        const clientSecret = req.headers.get('x-client');
        if (clientSecret !== 'lanzoor-web-dev-six-seven') {
            // same as here, check main.ts in core/src/main.ts for more info
            console.log('Limited by client secret');
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 403 });
        }

        const body = await req.json();

        const PATH_LENGTH_LIMIT = 250;
        const rawPath = body.path;

        if (typeof rawPath !== 'string') {
            throw new Error('Invalid path');
        }

        const path = normalizeDirectoryPath(rawPath);
        const pathFailConditions = {
            exceedsLimit: () => path.length > PATH_LENGTH_LIMIT,
            isTraversal: () => path.includes('..'),
        };

        if (pathFailConditions.exceedsLimit() || pathFailConditions.isTraversal()) {
            throw new Error('Invalid path');
        }

        // TODO: Find a way to improve and hopefully remove this
        const lanzoorDevResponse = await fetch(`https://www.lanzoor.dev${path}`);
        const responseFailConditions = {
            isNotOk: () => !lanzoorDevResponse.ok,
            isNotFound: () => lanzoorDevResponse.status === 404,
        };

        if (responseFailConditions.isNotOk() || responseFailConditions.isNotFound()) {
            throw new Error("Invalid path, couldn't find path within lanzoor.dev");
        }

        let userAgent = (req.headers.get('user-agent') ?? '').trim().slice(0, 500);

        userAgent = userAgent
            .replace(/[<>"'\\]/g, '')
            .replace(/[\x00-\x1F\x7F]/g, '')
            .trim();

        if (userAgent.length === 0) {
            userAgent = 'Unknown';
        }

        const userAgentLower = userAgent.toLowerCase();
        const botKeywords = ['bot', 'crawler', 'spider', 'ahrefs', 'semrush', 'googlebot', 'bingbot', 'slurp'];

        if (botKeywords.some((keyword) => userAgentLower.includes(keyword)) || userAgent.length >= 400) {
            throw new Error('The user-agent is likely a bot.');
        }

        const visitorId = req.headers.get('x-visitor-id') ?? '';
        const visitorIdFailConditions = {
            isMissing: () => visitorId.trim() === '',
            hasInvalidFormat: () => !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId),
        };

        if (visitorIdFailConditions.isMissing() || visitorIdFailConditions.hasInvalidFormat()) {
            throw new Error('The visitor ID is invalid, or it does not match the format.');
        }

        const rawCountry = req.headers.get('x-vercel-ip-country') ?? '';
        const countryConditions = {
            isPresent: () => rawCountry.trim() !== '',
            matchesFormat: () => /^[A-Z]{2}$/.test(rawCountry.trim().toUpperCase()),
        };

        const country = countryConditions.isPresent() && countryConditions.matchesFormat() ? rawCountry.trim().toUpperCase() : 'Unknown';

        let referrer = 'Unknown';

        try {
            const rawReferrer = req.headers.get('referer') ?? '';

            if (rawReferrer) {
                const url = new URL(rawReferrer);
                referrer = (url.hostname + url.pathname).slice(0, 300);
            }
        } catch {}

        const timestamp = Date.now();

        const args = [path, userAgent, visitorId, country, timestamp, referrer];
        console.log(args);

        await CoreDB.execute({
            sql: `
                INSERT INTO visits (path, useragent, visitorid, country, timestamp, referrer)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            args: args,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return handleErrors(error, 204);
    }
}
