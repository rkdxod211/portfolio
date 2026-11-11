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

const updateEntry = (table, label) => handle(async (req, res) => {
    const { title, detail } = req.body;
    const data = check(await supabase.from(table).update({ title, detail }).eq('id', req.params.id).select());
    if (data.length === 0) return res.status(404).json({ error: `${label} not found` });
    res.json({ message: `${label} updated successfully` });
});

router.put('/experience/clubs/:id', requireAdmin, updateEntry('experience_clubs', 'Club/activity'));
router.put('/experience/work/:id', requireAdmin, updateEntry('experience_work', 'Work experience'));

router.get('/contact', handle(async (req, res) => {
    const data = check(await supabase.from('contact').select('email1, email2, github, linkedin').eq('id', 1).maybeSingle());
    if (!data) return res.status(404).json({ error: 'Contact info not found' });
    res.json({
        emails: [data.email1, data.email2],
        github: data.github,
        linkedin: data.linkedin
    });
}));

router.put('/contact', requireAdmin, handle(async (req, res) => {
    const { emails = [], github, linkedin } = req.body;
    check(await supabase.from('contact').upsert({
        id: 1, email1: emails[0] || '', email2: emails[1] || '', github, linkedin
    }));
    res.json({ message: 'Contact info updated successfully' });
}));

module.exports = router;
