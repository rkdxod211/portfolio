import React, { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { adminFetch } from '../adminApi';

// Admin: choose which GitHub repos appear on the Projects page.
export default function ProjectVisibility() {
    const [projects, setProjects] = useState([]);
    const [visible, setVisible] = useState(new Set());
    const [saved, setSaved] = useState(new Set());
    const [status, setStatus] = useState('loading'); // loading | ready | saving | error
    const [error, setError] = useState('');

    const load = async () => {
        setStatus('loading');
        try {
            const res = await adminFetch('/api/projects/all');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load projects');
            const ids = new Set(data.filter(p => p.visible).map(p => p.id));
            setProjects(data);
            setVisible(ids);
            setSaved(ids);
            setStatus('ready');
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    };

    useEffect(() => { load(); }, []);

    const toggle = (id) => {
        setVisible(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const setAll = (on) => setVisible(on ? new Set(projects.map(p => p.id)) : new Set());

    const save = async () => {
        setStatus('saving');
        try {
            const res = await adminFetch('/api/projects/visibility', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visibleIds: [...visible] })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save');
            setSaved(new Set(visible));
            setStatus('ready');
            alert('SAVED');
        } catch (err) {
            setStatus('ready');
            alert('ERROR: ' + err.message);
        }
    };

    const dirty = visible.size !== saved.size || [...visible].some(id => !saved.has(id));

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Projects Section</h2>
                <div className="edit-actions">
                    <button onClick={load} className="btn-edit" disabled={status === 'loading'}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button onClick={save} className="btn-save" disabled={!dirty || status === 'saving'}>
                        <Save size={16} /> {status === 'saving' ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5, color: '#1d3557', margin: '0 0 16px' }}>
                Projects come from your public GitHub repositories. Check the ones you want to show
                on the site. New repos appear here automatically and are shown until you uncheck them.
            </p>

            {status === 'loading' && <p style={{ fontSize: '16px' }}>Loading…</p>}
            {status === 'error' && <p style={{ fontSize: '16px', color: '#c0392b' }}>Couldn't load projects: {error}</p>}

            {projects.length > 0 && (
                <>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <button onClick={() => setAll(true)} className="btn-edit">Select all</button>
                        <button onClick={() => setAll(false)} className="btn-edit">Clear all</button>
                        <span style={{ alignSelf: 'center', fontSize: '15px', fontWeight: 600, color: '#1d3557' }}>
                            {visible.size} of {projects.length} shown
                        </span>
                    </div>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Show</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Likes</th>
                                    <th>Views</th>
                                    <th>Downloads</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p) => (
                                    <tr
                                        key={p.id}
                                        onClick={() => toggle(p.id)}
                                        style={{ cursor: 'pointer', opacity: visible.has(p.id) ? 1 : 0.5 }}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={visible.has(p.id)}
                                                onChange={() => toggle(p.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td>
                                            <a
                                                href={p.githubLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {p.name}
                                            </a>
                                        </td>
                                        <td>{p.description || <em style={{ opacity: 0.6 }}>No description</em>}</td>
                                        <td>{p.likes}</td>
                                        <td>{p.views}</td>
                                        <td>{p.downloads}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
