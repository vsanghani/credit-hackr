function decodeBasicAuth(authHeader) {
    if (!authHeader || !authHeader.startsWith('Basic ')) return null;
    const base64 = authHeader.slice(6).trim();
    try {
        const decoded = Buffer.from(base64, 'base64').toString('utf8');
        const separator = decoded.indexOf(':');
        if (separator < 0) return null;
        return {
            username: decoded.slice(0, separator),
            password: decoded.slice(separator + 1)
        };
    } catch {
        return null;
    }
}

export function requireAnalyticsBasicAuth(req, res) {
    const expectedUser = process.env.ANALYTICS_AUTH_USER;
    const expectedPass = process.env.ANALYTICS_AUTH_PASS;

    // If env vars are not set, preserve existing behavior.
    if (!expectedUser || !expectedPass) return true;

    const credentials = decodeBasicAuth(req.headers.authorization);
    const ok = credentials && credentials.username === expectedUser && credentials.password === expectedPass;

    if (!ok) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Analytics Dashboard"');
        res.status(401).json({ error: 'Authentication required' });
        return false;
    }

    return true;
}
