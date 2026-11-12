const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const handle = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const check = ({ data, error }) => {
    if (error) throw error;
    return data;
};

// Tools categories shown under About; each value is a comma-separated list.
const TOOL_KEYS = ['languages', 'frameworks', 'databases', 'devtools'];
const pickTools = (tools = {}) =>
    Object.fromEntries(TOOL_KEYS.map(k => [k, typeof tools[k] === 'string' ? tools[k].trim() : '']));

router.get('/about', handle(async (req, res) => {
    const data = check(await supabase.from('about').select('interests, tools').eq('id', 1).maybeSingle());
    if (!data) return res.status(404).json({ error: 'About content not found' });
    res.json({ interests: data.interests || '', tools: pickTools(data.tools || {}) });
}));

router.put('/about', requireAdmin, handle(async (req, res) => {
    const { interests, tools } = req.body;
    check(await supabase.from('about').upsert({ id: 1, interests, tools: pickTools(tools) }));
    res.json({ message: 'About content updated successfully' });
}));

router.get('/education', handle(async (req, res) => {
    res.json(check(await supabase.from('education').select('*').order('display_order')));
}));

router.put('/education/:id', requireAdmin, handle(async (req, res) => {
    const { institution, period, degree, display_order } = req.body;
    check(await supabase.from('education')
        .update({ institution, period, degree, display_order })
        .eq('id', req.params.id));
    res.json({ message: 'Education updated successfully' });
}));

router.post('/education', requireAdmin, handle(async (req, res) => {
    const { institution, period, degree, display_order } = req.body;
    const data = check(await supabase.from('education')
        .insert({ institution, period, degree, display_order: display_order || 0 })
        .select()
        .single());
    res.status(201).json(data);
}));

router.delete('/education/:id', requireAdmin, handle(async (req, res) => {
    check(await supabase.from('education').delete().eq('id', req.params.id));
    res.json({ message: 'Education deleted successfully' });
}));

const ENTRY_FIELDS = 'id, title, detail, start_date, end_date';

router.get('/experience', handle(async (req, res) => {
    const [lang, clubs, work] = await Promise.all([
        supabase.from('experience_languages').select('languages').eq('id', 1).maybeSingle(),
        supabase.from('experience_clubs').select(ENTRY_FIELDS).order('id'),
        supabase.from('experience_work').select(ENTRY_FIELDS).order('id')
    ]);
    res.json({
        languages: check(lang)?.languages || '',
        clubs: check(clubs),
        work: check(work)
    });
}));

router.put('/experience/languages', requireAdmin, handle(async (req, res) => {
    check(await supabase.from('experience_languages').upsert({ id: 1, languages: req.body.languages }));
    res.json({ message: 'Languages updated successfully' });
}));

// Replace a whole list in one request: rows missing from `items` are deleted,
// rows with an id are updated, rows without an id are inserted.
async function syncList(table, items, pick) {
    if (!Array.isArray(items)) throw Object.assign(new Error('items must be an array'), { status: 400 });

    const existing = check(await supabase.from(table).select('id'));
    const keep = new Set(items.filter(i => i.id).map(i => Number(i.id)));
    const toDelete = existing.map(r => r.id).filter(id => !keep.has(id));
    if (toDelete.length) check(await supabase.from(table).delete().in('id', toDelete));

    const rows = items.map((item, index) => ({ ...(item.id ? { id: Number(item.id) } : {}), ...pick(item, index) }));
    const updates = rows.filter(r => r.id);
    const inserts = rows.filter(r => !r.id);
    if (updates.length) check(await supabase.from(table).upsert(updates));
    if (inserts.length) check(await supabase.from(table).insert(inserts));
}

const syncRoute = (table, pick, isEmpty, select, order) => handle(async (req, res) => {
    const items = (req.body.items || []).filter(i => !isEmpty(i));
    try {
        await syncList(table, items, pick);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
    res.json(check(await supabase.from(table).select(select).order(order)));
});

const text = (v) => (typeof v === 'string' ? v.trim() : '');

const pickEntry = (i) => ({
    title: text(i.title),
    detail: text(i.detail),
    start_date: text(i.start_date),
    end_date: text(i.end_date)
});
const emptyEntry = (i) => !text(i.title) && !text(i.detail);

router.put('/experience/clubs', requireAdmin, syncRoute('experience_clubs', pickEntry, emptyEntry, ENTRY_FIELDS, 'id'));
router.put('/experience/work', requireAdmin, syncRoute('experience_work', pickEntry, emptyEntry, ENTRY_FIELDS, 'id'));

const RESEARCH_TEXT = ['title', 'role', 'lab', 'advisor', 'location', 'start_date', 'end_date',
    'tags', 'question', 'description', 'outcomes', 'link'];
const RESEARCH_FIELDS = ['id', ...RESEARCH_TEXT, 'display_order'].join(', ');

router.get('/research', handle(async (req, res) => {
    res.json(check(await supabase.from('research').select(RESEARCH_FIELDS).order('display_order')));
}));

router.put('/research', requireAdmin, syncRoute(
    'research',
    (i, index) => ({
        ...Object.fromEntries(RESEARCH_TEXT.map(k => [k, text(i[k])])),
        display_order: index
    }),
    (i) => !text(i.title),
    RESEARCH_FIELDS,
    'display_order'
));

const CONTACT_FIELDS = 'id, type, label, value, display_order';

router.get('/contact', handle(async (req, res) => {
    res.json(check(await supabase.from('contact_items').select(CONTACT_FIELDS).order('display_order')));
}));

router.put('/contact', requireAdmin, syncRoute(
    'contact_items',
    (i, index) => ({
        type: i.type === 'email' ? 'email' : 'link',
        label: (i.label || '').trim(),
        value: (i.value || '').trim(),
        display_order: index
    }),
    (i) => !(i.value || '').trim(),
    CONTACT_FIELDS,
    'display_order'
));

module.exports = router;
