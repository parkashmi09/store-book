import { NextResponse } from 'next/server'

const BASE_URL = 'https://api.targetboardstore.com'

async function forward(request: Request, path: string) {
    const url = new URL(request.url)
    const targetUrl = `${BASE_URL}/${path}${url.search}`

    // Clone incoming headers and forward most of them to avoid WAF blocks
    const headers = new Headers()
    request.headers.forEach((value, key) => {
        const k = key.toLowerCase()
        if ([
            'host',
            'connection',
            'content-length',
            'accept-encoding'
        ].includes(k)) {
            return
        }
        headers.set(key, value)
    })

    const method = request.method
    const hasBody = method !== 'GET' && method !== 'HEAD'
    const body = hasBody ? await request.text() : undefined

    const res = await fetch(targetUrl, {
        method,
        headers: headers as any,
        body,
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}

export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/')
    return forward(_request, path)
}

export async function POST(_request: Request, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/')
    return forward(_request, path)
}

export async function PUT(_request: Request, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/')
    return forward(_request, path)
}

export async function DELETE(_request: Request, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/')
    return forward(_request, path)
}


