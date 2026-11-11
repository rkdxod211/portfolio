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

router.get('/about', handle(async (req, res) => {
    const data = check(await supabase.from('about').select('introduction, interests').eq('id', 1).maybeSingle());
    if (!data) return res.status(404).json({ error: 'About content not found' });
    res.json(data);
}));

router.put('/about', requireAdmin, handle(async (req, res) => {
    const { introduction, interests } = req.body;
    check(await supabase.from('about').upsert({ id: 1, introduction, interests }));
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

router.get('/experience', handle(async (req, res) => {
    const [lang, clubs, work] = await Promise.all([
        supabase.from('experience_languages').select('languages').eq('id', 1).maybeSingle(),
        supabase.from('experience_clubs').select('id, title, detail').order('id'),
        supabase.from('experience_work').select('id, title, detail').order('id')
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

const pickEntry = (i) => ({ title: (i.title || '').trim(), detail: (i.detail || '').trim() });
const emptyEntry = (i) => !(i.title || '').trim() && !(i.detail || '').trim();

router.put('/experience/clubs', requireAdmin, syncRoute('experience_clubs', pickEntry, emptyEntry, 'id, title, detail', 'id'));
router.put('/experience/work', requireAdmin, syncRoute('experience_work', pickEntry, emptyEntry, 'id, title, detail', 'id'));

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
