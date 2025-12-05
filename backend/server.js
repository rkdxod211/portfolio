const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const visitorsRouter = require('./routes/visitors');
const contentRouter = require('./routes/content');
const guestbookRouter = require('./routes/guestbook');
const projectsRouter = require('./routes/projects');
const authRouter = require('./routes/auth');
app.use('/api/visitors', visitorsRouter);
app.use('/api/content', contentRouter);
app.use('/api/guestbook', guestbookRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Portfolio Backend API',
        version: '1.0.0',
        endpoints: {
            test: '/api/test',
            visitors: '/api/visitors/total'
        }
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend server is running!',
        timestamp: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});