import { NextResponse, NextRequest } from 'next/server';

export const coreVersions: Record<any, string> = {
    frontend: 'v26.24.2147483647',
    backend: 'v26.1.15',
};

export const CORSHeadersAllowAll = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client, X-Visitor-Id',
};

export const debugRequest = (request: NextRequest) => {
    console.log('Ping invoked!', {
        method: request.method,
        url: request.url,
    });
};

export const handleOptions = (headers: Record<string, string> = CORSHeadersAllowAll) => {
    return new NextResponse(null, {
        status: 200,
        headers: headers,
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

    return NextResponse.json(
        {
            ok: false,
            code,
            message,
            timestamp: Date.now(),
        },
        {
            status,
            headers: CORSHeadersAllowAll,
        }
    );
};
