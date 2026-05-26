import { NextRequest, NextResponse } from 'next/server';
import { CORSHeadersAllowAll, handleOptions, handleErrors, debugRequest } from '@/lib/api';

export async function OPTIONS() {
    return handleOptions();
}

export async function GET(req: NextRequest) {
    try {
        debugRequest(req);

        return NextResponse.json(
            {
                ok: true,
                message: 'I am permanently a teapot. I refuse to brew coffee.',
            },
            {
                status: 418,
                headers: CORSHeadersAllowAll,
            }
        );
    } catch (error: any) {
        return handleErrors(error);
    }
}
