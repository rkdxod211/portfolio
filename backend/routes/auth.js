const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    const query = 'SELECT * FROM admin WHERE username = ?';
    
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const user = results[0];
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                res.json({ 
                    success: true,
                    message: 'Login successful'
                });
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (compareError) {
            res.status(500).json({ error: 'Login failed' });
        }
    });
});

module.exports = router;