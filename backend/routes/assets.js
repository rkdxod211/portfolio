const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const BUCKET = 'site-assets';

// Slots the admin can replace, and the file types each accepts.
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const SLOTS = {
    profile: IMAGE_TYPES,
    resume: { 'application/pdf': 'pdf' }
};

// Vercel rejects request bodies over 4.5 MB, so stay under that.
const MAX_BYTES = 4 * 1024 * 1024;

const check = ({ data, error }) => {
    if (error) throw error;
    return data;
};

const handle = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

const fail = (status, message) => Object.assign(new Error(message), { status });

// { profile: url | null, resume: url | null }
router.get('/', handle(async (req, res) => {
    const rows = check(await supabase.from('site_assets').select('key, url'));
    const result = Object.fromEntries(Object.keys(SLOTS).map(k => [k, null]));
    rows.forEach(r => { if (r.key in result) result[r.key] = r.url; });
    res.json(result);
}));

const removeOld = async (key) => {
    const old = check(await supabase.from('site_assets').select('path').eq('key', key).maybeSingle());
    if (old) await supabase.storage.from(BUCKET).remove([old.path]); // best effort
};

// Body is the raw file; Content-Type says what it is.
router.put('/:key', requireAdmin, express.raw({ type: () => true, limit: MAX_BYTES }), handle(async (req, res) => {
    const { key } = req.params;
    const types = SLOTS[key];
    if (!types) throw fail(404, `Unknown asset "${key}"`);

    const contentType = (req.headers['content-type'] || '').split(';')[0].trim();
    const ext = types[contentType];
    if (!ext) throw fail(400, `Unsupported file type for ${key}: ${contentType || 'unknown'}`);
    if (!Buffer.isBuffer(req.body) || !req.body.length) throw fail(400, 'Empty file');

    // A new path per upload so browsers and CDNs never serve a stale copy.
    const path = `${key}/${Date.now()}.${ext}`;
    check(await supabase.storage.from(BUCKET).upload(path, req.body, { contentType, upsert: false }));
    const { publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path).data;

    await removeOld(key);
    check(await supabase.from('site_assets').upsert({ key, path, url: publicUrl, updated_at: new Date().toISOString() }));
    res.json({ key, url: publicUrl });
}));

// Remove the upload: grey placeholder for the profile, no resume.
router.delete('/:key', requireAdmin, handle(async (req, res) => {
    const { key } = req.params;
    if (!SLOTS[key]) throw fail(404, `Unknown asset "${key}"`);
    await removeOld(key);
    check(await supabase.from('site_assets').delete().eq('key', key));
    res.json({ key, url: null });
}));

// express.raw's size error arrives here.
router.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: `File is too large (max ${MAX_BYTES / 1024 / 1024} MB)` });
    }
    next(err);
});

module.exports = router;
