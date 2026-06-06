import { NextRequest, NextResponse } from 'next/server';
import { coreVersions, CORSHeadersAllowAll, handleOptions, handleErrors, debugRequest } from '@/lib/api';
import { CoreAnalyticsDB } from '@/lib/db';

export async function OPTIONS() {
    return handleOptions();
}

export async function POST(req: NextRequest) {
    try {
        debugRequest(req);

        const body = await req.json();

        const path = body.path;

        if (typeof body.path !== 'string') {
            throw new Error('Invalid path, excluding from analytics.');
        }

        const origin = req.headers.get('origin') ?? '';
        const country = req.headers.get('x-vercel-ip-country') ?? 'Unknown';
        const userAgent = req.headers.get('user-agent') ?? '';
        const referrer = req.headers.get('referer') ?? null;

        if (/bot|crawler|spider|ahrefs|bingbot|googlebot/i.test(userAgent)) {
            throw new Error('The user-agent is a bot, excluding from analytics.');
        }

        const trustedOrigins = ['https://lanzoor.dev', 'https://www.lanzoor.dev'];

        if (!trustedOrigins.includes(origin)) {
            throw new Error('The origin is untrusted, excluding from analytics.');
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
        INSERT INTO visits (
            path,
            country,
            timestamp,
            referrer
        )
        VALUES (?, ?, ?, ?)
    `,
            args: [analytics.path, analytics.country, analytics.timestamp, analytics.referrer],
        });
        return NextResponse.json(analytics);
    } catch (error: any) {
        return handleErrors(error);
    }
}
