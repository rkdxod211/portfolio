const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const bcrypt = require('bcryptjs');
const { issueToken } = require('../middleware/auth');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const { data: user, error } = await supabase
        .from('admin')
        .select('password')
        .eq('username', username)
        .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    try {
        if (await bcrypt.compare(password, user.password)) {
            res.json({ success: true, message: 'Login successful', token: issueToken(username) });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (compareError) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
