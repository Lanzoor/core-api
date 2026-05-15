import { NextResponse, NextRequest } from 'next/server';

export const versions: Record<any, string> = {
    frontend: 'v26.20.6',
    backend: 'v26.1.8',
};

export const CORSHeadersAllowAll = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export const handleOptions = (headers: Record<string, string> = CORSHeadersAllowAll) => {
    return new NextResponse(null, {
        status: 200,
        headers: headers,
    });
};

export const handleErrors = (error: unknown) => {
    let message = 'Internal server error';
    let code = 'UNKNOWN_ERROR';

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
            status: 500,
            headers: CORSHeadersAllowAll,
        }
    );
};
