const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/increment', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const checkQuery = 'SELECT * FROM visitor_stats WHERE date = ?';
    
    db.query(checkQuery, [today], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length > 0) {
            const updateQuery = 'UPDATE visitor_stats SET count = count + 1 WHERE date = ?';
            db.query(updateQuery, [today], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                db.query(checkQuery, [today], (err, updated) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ count: updated[0].count });
                });
            });
        } else {
            const insertQuery = 'INSERT INTO visitor_stats (date, count) VALUES (?, 1)';
            db.query(insertQuery, [today], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ count: 1 });
            });
        }
    });
});

router.get('/total', (req, res) => {
    const query = 'SELECT SUM(count) as total FROM visitor_stats';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ total: results[0].total || 0 });
    });
});

module.exports = router;