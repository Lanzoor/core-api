import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

const rateLimitPerSecond = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 s'),
    analytics: true,
});

const rateLimitPerMinute = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: true,
});

function isValidIp(ip: string): boolean {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    const ipv6 = /^([0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}$/;

    return ipv4.test(ip) || ipv6.test(ip);
}

function getClientIp(req: NextRequest): string {
    const vercelIp = req.headers.get('x-vercel-ip');

    if (vercelIp && isValidIp(vercelIp)) {
        return vercelIp;
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const ip = forwardedFor.split(',')[0].trim();
        if (isValidIp(ip)) return ip;
    }

    const realIp = req.headers.get('x-real-ip');
    if (realIp && isValidIp(realIp)) {
        return realIp;
    }

    return 'anonymous';
}

export async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
    try {
        const ip = getClientIp(req);

        const { success: successPerSecond } = await rateLimitPerSecond.limit(`${ip}:per-sec`);

        if (!successPerSecond) {
            return NextResponse.json({ error: 'Too many requests (burst limit)' }, { status: 429 });
        }

        const { success: successPerMinute, limit, remaining, reset } = await rateLimitPerMinute.limit(`${ip}:per-min`);

        if (!successPerMinute) {
            return NextResponse.json(
                {
                    error: 'Too many requests in a certain window',
                    message: "You're being rate limited!\nPlease refer to https://api.lanzoor.dev/docs/rate-limit for more information.",
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                    },
                }
            );
        }

        return null;
    } catch (err) {
        console.error('Rate limit error:', err);
        return null;
    }
}
