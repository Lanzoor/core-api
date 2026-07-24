import { NextResponse, NextRequest } from 'next/server';

export const coreVersions: Record<any, string> = {
    frontend: 'v26.26.0',
    backend: 'v26.2.0',
};

export const DEFAULT_CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
} satisfies HeadersInit;

export function corsJson(body: unknown, init: ResponseInit = {}, headers: HeadersInit = {}) {
    return NextResponse.json(body, {
        ...init,
        headers: {
            ...DEFAULT_CORS_HEADERS,
            ...headers,
            ...(init.headers ?? {}),
        },
    });
}

export function corsResponse(
    body: BodyInit | null = null,
    init: ResponseInit = {},
    headers: HeadersInit = {}
) {
    return new Response(body, {
        ...init,
        headers: {
            ...DEFAULT_CORS_HEADERS,
            ...headers,
            ...(init.headers ?? {}),
        },
    });
}

export const debugRequest = (request: NextRequest) => {
    console.log('Ping invoked!', {
        method: request.method,
        url: request.url,
    });
};

export const handleErrors = (error: unknown, status: number = 500) => {
    let message = 'Internal server error';
    let code = 'Error';

    if (error instanceof Error) {
        message = error.message;
        code = error.name || 'Error';
    } else if (typeof error === 'string') {
        message = error;
    } else if (typeof error === 'object' && error !== null) {
        message = JSON.stringify(error);
    }

    console.error('[API Error]\n\t', error);

    return NextResponse.json({ success: false, data: { error: message } }, { status });
};
