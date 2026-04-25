import { NextResponse, NextRequest } from 'next/server';

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
        code = error.name || 'ERROR';
    } else if (typeof error === 'string') {
        message = error;
    } else if (typeof error === 'object' && error !== null) {
        message = JSON.stringify(error);
    }

    console.error('[API ERROR]', error);

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
