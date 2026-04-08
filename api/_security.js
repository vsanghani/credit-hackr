const rateLimitStore = new Map();

function nowMs() {
    return Date.now();
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    return req.socket?.remoteAddress || 'unknown';
}

export function getRequestOrigin(req) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return `${proto}://${host}`;
}

export function applyApiSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export function enforceSameOriginForPost(req, res) {
    const origin = req.headers.origin;
    if (!origin) return true;

    try {
        const originHost = new URL(origin).host;
        const requestHost = req.headers['x-forwarded-host'] || req.headers.host;
        if (originHost !== requestHost) {
            res.status(403).json({ error: 'Cross-origin requests are not allowed' });
            return false;
        }
        return true;
    } catch {
        res.status(400).json({ error: 'Invalid Origin header' });
        return false;
    }
}

export function enforceRateLimit(req, res, key, limit = 60, windowMs = 60_000) {
    const ip = getClientIp(req);
    const storeKey = `${key}:${ip}`;
    const current = rateLimitStore.get(storeKey);
    const timestamp = nowMs();

    if (!current || timestamp > current.resetAt) {
        rateLimitStore.set(storeKey, { count: 1, resetAt: timestamp + windowMs });
        return true;
    }

    if (current.count >= limit) {
        const retryAfter = Math.ceil((current.resetAt - timestamp) / 1000);
        res.setHeader('Retry-After', String(Math.max(1, retryAfter)));
        res.status(429).json({ error: 'Too many requests' });
        return false;
    }

    current.count += 1;
    rateLimitStore.set(storeKey, current);
    return true;
}

export function safeJsonStringify(value, maxLength = 4000) {
    try {
        const json = JSON.stringify(value ?? {});
        if (json.length <= maxLength) return json;
        return JSON.stringify({ truncated: true });
    } catch {
        return JSON.stringify({});
    }
}

export function getClientIpAddress(req) {
    return getClientIp(req);
}
