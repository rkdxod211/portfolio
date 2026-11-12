const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contentRouter = require('./routes/content');
const projectsRouter = require('./routes/projects');
const authRouter = require('./routes/auth');
const assetsRouter = require('./routes/assets');
app.use('/api/content', contentRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);
app.use('/api/assets', assetsRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'Portfolio Backend API',
        version: '1.0.0',
        endpoints: {
            test: '/api/test'
        }
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend server is running!',
        timestamp: new Date()
    });
});

// Locally: `node server.js`. On Vercel the app is exported via api/index.js.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;