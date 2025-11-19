const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ============ ABOUT SECTION ============

// Get about content
router.get('/about', (req, res) => {
    const query = 'SELECT introduction, interests FROM about LIMIT 1';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('About 에러:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'About content not found' });
        }
        
        console.log('✅ About 데이터 전송:', results[0]);
        res.json(results[0]);
    });
});

// Update about content (admin only)
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

// ============ EXPERIENCE SECTION ============

// Get all experience data
router.get('/experience', (req, res) => {
    const queries = {
        languages: 'SELECT languages FROM experience_languages LIMIT 1',
        clubs: 'SELECT id, title, detail FROM experience_clubs ORDER BY id',
        work: 'SELECT id, title, detail FROM experience_work ORDER BY id'
    };
    
    db.query(queries.languages, (err1, langResults) => {
        if (err1) {
            console.error('Languages 에러:', err1);
            return res.status(500).json({ error: err1.message });
        }
        
        db.query(queries.clubs, (err2, clubResults) => {
            if (err2) {
                console.error('Clubs 에러:', err2);
                return res.status(500).json({ error: err2.message });
            }
            
            db.query(queries.work, (err3, workResults) => {
                if (err3) {
                    console.error('Work 에러:', err3);
                    return res.status(500).json({ error: err3.message });
                }
                
                const result = {
                    languages: langResults[0]?.languages || '',
                    clubs: clubResults,
                    work: workResults
                };
                
                console.log('✅ Experience 데이터 전송:', result);
                res.json(result);
            });
        });
    });
});

// Update languages (admin only)
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

// Update club/activity (admin only)
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

// Update work experience (admin only)
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

// ============ CONTACT SECTION ============

// Get contact info
router.get('/contact', (req, res) => {
    const query = 'SELECT email1, email2, github, linkedin FROM contact LIMIT 1';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Contact 에러:', err);
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
        
        console.log('✅ Contact 데이터 전송:', result);
        res.json(result);
    });
});

// Update contact info (admin only)
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