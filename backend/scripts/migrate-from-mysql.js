// One-time copy of existing MySQL data into Supabase.
// Usage: cd backend && npm run migrate
// Safe to re-run: single-row tables are upserted; list tables are skipped if they already have data.
require('dotenv').config();
const mysql = require('mysql2/promise');
const supabase = require('../config/database');

const TABLES = [
    // [table, conflict key, row mapper]
    ['about', 'id', r => ({ id: r.id, introduction: r.introduction, interests: r.interests })],
    ['contact', 'id', r => ({ id: r.id, email1: r.email1, email2: r.email2, github: r.github, linkedin: r.linkedin })],
    ['experience_languages', 'id', r => ({ id: r.id, languages: r.languages })],
    ['experience_clubs', null, r => ({ title: r.title, detail: r.detail })],
    ['experience_work', null, r => ({ title: r.title, detail: r.detail })],
    ['education', null, r => ({ institution: r.institution, period: r.period, degree: r.degree, display_order: r.display_order })],
    ['guestbook', null, r => ({ nickname: r.nickname, message: r.message, created_at: r.created_at })],
    ['visitor_stats', 'date', r => ({
        date: r.date instanceof Date
            ? `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}-${String(r.date.getDate()).padStart(2, '0')}`
            : r.date,
        count: r.count
    })],
    ['admin', 'username', r => ({ username: r.username, password: r.password })]
];

async function checkSupabase() {
    const url = process.env.SUPABASE_URL || '';
    if (!url.startsWith('https://') || (process.env.SUPABASE_SERVICE_ROLE_KEY || '').startsWith('PASTE_')) {
        throw new Error('Fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env first.');
    }
    const missing = [];
    for (const t of [...TABLES.map(t => t[0]), 'project_stats']) {
        const { error } = await supabase.from(t).select('*', { head: true, count: 'exact' });
        if (error) missing.push(`${t} (${error.message})`);
    }
    if (missing.length) {
        throw new Error('Supabase schema not set up. Run backend/supabase/schema.sql in the SQL Editor.\n  ' + missing.join('\n  '));
    }
    console.log('✓ Supabase connected, all tables present');
}

async function main() {
    await checkSupabase();

    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    } catch (err) {
        console.log(`! Could not connect to MySQL (${err.message}). Nothing copied; Supabase is ready to use empty.`);
        return;
    }

    for (const [table, key, map] of TABLES) {
        let rows;
        try {
            [rows] = await db.query(`SELECT * FROM \`${table}\``);
        } catch (err) {
            console.log(`- ${table}: skipped (${err.message})`);
            continue;
        }
        if (rows.length === 0) {
            console.log(`- ${table}: empty`);
            continue;
        }
        let error;
        if (key) {
            ({ error } = await supabase.from(table).upsert(rows.map(map), { onConflict: key }));
        } else {
            // Let Supabase assign ids; skip if already migrated to avoid duplicates.
            const { count } = await supabase.from(table).select('*', { head: true, count: 'exact' });
            if (count > 0) {
                console.log(`- ${table}: already has ${count} rows in Supabase, skipped`);
                continue;
            }
            const sorted = [...rows].sort((a, b) => a.id - b.id);
            ({ error } = await supabase.from(table).insert(sorted.map(map)));
        }
        console.log(error ? `✗ ${table}: ${error.message}` : `✓ ${table}: ${rows.length} rows`);
    }

    await db.end();
    console.log('Done.');
}

main().catch(err => {
    console.error('✗ ' + err.message);
    process.exit(1);
});
