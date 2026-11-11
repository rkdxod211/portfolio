const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

router.post('/increment', async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { data, error } = await supabase.rpc('increment_visitor', { p_date: today });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ count: data });
});

router.get('/total', async (req, res) => {
    const { data, error } = await supabase.from('visitor_stats').select('count');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ total: data.reduce((sum, row) => sum + row.count, 0) });
});

module.exports = router;
