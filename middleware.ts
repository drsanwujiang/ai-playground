import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from "@/app/actions";

export function middleware(request: NextRequest) {
    if (!authenticate()) {
        if (
            request.nextUrl.pathname === '/' ||
            request.nextUrl.pathname.startsWith('/chat') ||
            request.nextUrl.pathname.startsWith('/paint')
        ) {
            return NextResponse.redirect(new URL('/auth', request.url));
        } else if (
            request.nextUrl.pathname.startsWith('/api/chat') ||
            request.nextUrl.pathname.startsWith('/api/paint')
        ) {
            return NextResponse.json({
                code: -1,
                message: "Token invalid"
            }, { status: 401 });
        }
    }

    return NextResponse.next();
}