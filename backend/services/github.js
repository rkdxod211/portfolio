require('dotenv').config();

const CACHE_MS = 10 * 60 * 1000; // re-fetch from GitHub at most every 10 minutes

let cache = { at: 0, repos: null };

const excluded = () =>
    (process.env.GITHUB_EXCLUDE || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

async function fetchRepos() {
    if (cache.repos && Date.now() - cache.at < CACHE_MS) return cache.repos;

    const username = process.env.GITHUB_USERNAME;
    if (!username) throw new Error('GITHUB_USERNAME is not set in backend/.env');

    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-backend' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const repos = [];
    for (let page = 1; ; page++) {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?type=owner&sort=pushed&per_page=100&page=${page}`,
            { headers }
        );
        if (!res.ok) {
            // Serve stale data rather than an empty page if GitHub is down or rate-limited
            if (cache.repos) return cache.repos;
            throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
        }
        const batch = await res.json();
        repos.push(...batch);
        if (batch.length < 100) break;
    }

    const skip = excluded();
    const filtered = repos.filter(r =>
        !r.fork &&
        !r.private &&
        r.name.toLowerCase() !== username.toLowerCase() && // profile README repo
        !skip.includes(r.name.toLowerCase()) &&
        !(r.topics || []).includes('portfolio-hide')
    );

    cache = { at: Date.now(), repos: filtered };
    return filtered;
}

function toProject(repo, stats = {}) {
    return {
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        thumbnail: `https://opengraph.githubassets.com/1/${repo.full_name}`,
        githubLink: repo.html_url,
        homepage: repo.homepage || '',
        language: repo.language || '',
        stars: repo.stargazers_count,
        downloadUrl: `https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch}.zip`,
        likes: stats.likes || 0,
        views: stats.views || 0,
        downloads: stats.downloads || 0
    };
}

async function isKnownRepo(repoId) {
    const repos = await fetchRepos();
    return repos.some(r => r.id === repoId);
}

module.exports = { fetchRepos, toProject, isKnownRepo };
