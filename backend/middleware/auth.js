const crypto = require('crypto');
require('dotenv').config();

// Minimal signed admin token: base64url(payload) + "." + HMAC-SHA256(payload).
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret() {
    const s = process.env.ADMIN_TOKEN_SECRET;
    if (!s || s.length < 32) throw new Error('ADMIN_TOKEN_SECRET must be set (32+ chars)');
    return s;
}

const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

function issueToken(username) {
    const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + TTL_MS })).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
    if (typeof token !== 'string' || !token.includes('.')) return null;
    const [payload, sig] = token.split('.');
    const expected = sign(payload);
    if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        return null;
    }
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
}

function requireAdmin(req, res, next) {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    try {
        if (verifyToken(token)) return next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(401).json({ error: 'Admin login required' });
}

module.exports = { issueToken, requireAdmin };
