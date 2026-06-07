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

function getClientIp(req: NextRequest): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const vercelIp = req.headers.get('x-vercel-ip');

    return forwardedFor?.split(',')[0]?.trim() || realIp || vercelIp || 'anonymous';
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
            console.log('rate limited')
            return NextResponse.json(
                { error: 'Too many requests' },
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
