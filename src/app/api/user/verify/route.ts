import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const token = request.headers.get('x-access-token') || ''
        const body = await request.json().catch(() => ({}))

        const upstreamResponse = await fetch('https://api.targetboardstore.com/verify', {
            method: 'POST',
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await upstreamResponse.json().catch(() => ({}))
        return NextResponse.json(data, { status: upstreamResponse.status })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'verify proxy failed' }, { status: 500 })
    }
}


