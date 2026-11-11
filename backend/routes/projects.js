const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { fetchRepos, toProject, isKnownRepo } = require('../services/github');
const { requireAdmin } = require('../middleware/auth');

// Projects are read live from GitHub (cached briefly), so adding or deleting
// a repository updates the site automatically. Counters and the admin's
// show/hide choice come from Supabase (project_stats).
async function loadProjects() {
    const repos = await fetchRepos();

    const { data: stats, error } = await supabase
        .from('project_stats')
        .select('*')
        .in('repo_id', repos.map(r => r.id));
    if (error) throw error;

    const statsById = Object.fromEntries((stats || []).map(s => [s.repo_id, s]));
    return repos.map(repo => ({
        ...toProject(repo, statsById[repo.id]),
        // New repos are visible until the admin hides them
        visible: !statsById[repo.id]?.hidden
    }));
}

// Public list: only projects the admin chose to show.
router.get('/', async (req, res) => {
    try {
        const projects = await loadProjects();
        res.json(projects.filter(p => p.visible));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin list: includes hidden projects.
router.get('/all', requireAdmin, async (req, res) => {
    try {
        res.json(await loadProjects());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Body: { visibleIds: [repoId, ...] } — every other repo gets hidden.
router.put('/visibility', requireAdmin, async (req, res) => {
    const visibleIds = new Set((req.body.visibleIds || []).map(Number));
    try {
        const repos = await fetchRepos();
        const rows = repos.map(r => ({ repo_id: r.id, hidden: !visibleIds.has(r.id) }));
        const { error } = await supabase.from('project_stats').upsert(rows, { onConflict: 'repo_id' });
        if (error) throw error;
        res.json({ message: 'Project visibility saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const counter = (field) => async (req, res) => {
    const repoId = Number(req.params.id);
    if (!Number.isInteger(repoId)) return res.status(400).json({ error: 'Invalid id' });

    try {
        if (!(await isKnownRepo(repoId))) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const { data, error } = await supabase.rpc('increment_project_stat', {
            p_repo_id: repoId,
            p_field: field
        });
        if (error) throw error;
        res.json({ [field]: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

router.post('/:id/view', counter('views'));
router.post('/:id/like', counter('likes'));
router.post('/:id/download', counter('downloads'));

module.exports = router;
