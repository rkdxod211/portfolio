const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/about', (req, res) => {
    const query = 'SELECT introduction, interests FROM about LIMIT 1';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'About content not found' });
        }
        
        res.json(results[0]);
    });
});

router.put('/about', (req, res) => {
    const { introduction, interests } = req.body;
    
    const query = 'UPDATE about SET introduction = ?, interests = ? WHERE id = 1';
    
    db.query(query, [introduction, interests], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'About content updated successfully' });
    });
});

router.get('/education', (req, res) => {
    const query = 'SELECT * FROM education ORDER BY display_order';  // ← 이미 있음
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.put('/education/:id', (req, res) => {
    const { id } = req.params;
    const { institution, period, degree, display_order } = req.body;
    
    const query = `
        UPDATE education 
        SET institution = ?, period = ?, degree = ?, display_order = ?
        WHERE id = ?
    `;
    
    db.query(query, [institution, period, degree, display_order, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Education updated successfully' });
    });
});

router.post('/education', (req, res) => {
    const { institution, period, degree, display_order } = req.body;
    
    const query = `
        INSERT INTO education (institution, period, degree, display_order)
        VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [institution, period, degree, display_order || 0], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: result.insertId,
            institution,
            period,
            degree,
            display_order: display_order || 0
        });
    });
});

router.delete('/education/:id', (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM education WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Education deleted successfully' });
    });
});

router.get('/experience', (req, res) => {
    const queries = {
        languages: 'SELECT languages FROM experience_languages LIMIT 1',
        clubs: 'SELECT id, title, detail FROM experience_clubs ORDER BY id',
        work: 'SELECT id, title, detail FROM experience_work ORDER BY id'
    };
    
    db.query(queries.languages, (err1, langResults) => {
        if (err1) {
            return res.status(500).json({ error: err1.message });
        }
        
        db.query(queries.clubs, (err2, clubResults) => {
            if (err2) {
                return res.status(500).json({ error: err2.message });
            }
            
            db.query(queries.work, (err3, workResults) => {
                if (err3) {
                    return res.status(500).json({ error: err3.message });
                }
                
                const result = {
                    languages: langResults[0]?.languages || '',
                    clubs: clubResults,
                    work: workResults
                };
                
                res.json(result);
            });
        });
    });
});

router.put('/experience/languages', (req, res) => {
    const { languages } = req.body;
    
    const query = 'UPDATE experience_languages SET languages = ? WHERE id = 1';
    
    db.query(query, [languages], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Languages updated successfully' });
    });
});

router.put('/experience/clubs/:id', (req, res) => {
    const { id } = req.params;
    const { title, detail } = req.body;
    
    const query = 'UPDATE experience_clubs SET title = ?, detail = ? WHERE id = ?';
    
    db.query(query, [title, detail, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Club/activity not found' });
        }
        
        res.json({ message: 'Club/activity updated successfully' });
    });
});

router.put('/experience/work/:id', (req, res) => {
    const { id } = req.params;
    const { title, detail } = req.body;
    
    const query = 'UPDATE experience_work SET title = ?, detail = ? WHERE id = ?';
    
    db.query(query, [title, detail, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Work experience not found' });
        }
        
        res.json({ message: 'Work experience updated successfully' });
    });
});

router.get('/contact', (req, res) => {
    const query = 'SELECT email1, email2, github, linkedin FROM contact LIMIT 1';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Contact info not found' });
        }
        
        const contact = results[0];
        const result = {
            emails: [contact.email1, contact.email2],
            github: contact.github,
            linkedin: contact.linkedin
        };
        
        res.json(result);
    });
});

router.put('/contact', (req, res) => {
    const { emails, github, linkedin } = req.body;
    
    const query = 'UPDATE contact SET email1 = ?, email2 = ?, github = ?, linkedin = ? WHERE id = 1';
    
    db.query(query, [emails[0], emails[1], github, linkedin], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Contact info updated successfully' });
    });
});

module.exports = router;