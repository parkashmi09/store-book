import type { NextRequest, NextResponse } from 'next/server';

export function getToken(request: NextRequest): string {
    return request.cookies.get('token')?.value || '';
}

