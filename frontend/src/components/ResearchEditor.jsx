import React from 'react';
import { X } from 'lucide-react';
import { formatPeriod } from '../format';

const EMPTY = {
    title: '', role: '', lab: '', advisor: '', location: '', start_date: '', end_date: '',
    tags: '', question: '', description: '', outcomes: '', link: ''
};

// One-line inputs, laid out two per row.
const SHORT_FIELDS = [
    { key: 'title', label: 'Title', placeholder: 'Project title (required)' },
    { key: 'role', label: 'Role', placeholder: 'e.g. Undergraduate Researcher' },
    { key: 'lab', label: 'Lab', placeholder: 'Lab or group name (optional)' },
    { key: 'advisor', label: 'Advisor / PI', placeholder: 'Optional' },
    { key: 'location', label: 'Location', placeholder: 'e.g. Madison, WI' },
    { key: 'tags', label: 'Fields (tags)', placeholder: 'Comma-separated, e.g. Cryptography, ML' },
    { key: 'start_date', label: 'Start', placeholder: 'e.g. Sep 2025' },
    { key: 'end_date', label: 'End', placeholder: 'Blank = Present' },
    { key: 'outcomes', label: 'Outcomes', placeholder: 'Paper, poster, talk (optional)' },
    { key: 'link', label: 'Link', placeholder: 'Lab or project URL (optional)' }
];

const LONG_FIELDS = [
    { key: 'question', label: 'Research Question', placeholder: 'What question does this research answer?' },
    { key: 'description', label: 'Description', placeholder: 'Problem, approach, your part, results' }
];

// Admin: edit the list of research entries. Entries without a title are dropped on save.
export default function ResearchEditor({ items, editing, onChange }) {
    const update = (index, key, value) =>
        onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
    const remove = (index) => onChange(items.filter((_, i) => i !== index));
    const move = (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= items.length) return;
        const list = [...items];
        [list[index], list[target]] = [list[target], list[index]];
        onChange(list);
    };

    if (!editing) {
        return (
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Role</th>
                            <th>Lab</th>
                            <th>Dates</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{item.title}</td>
                                <td>{item.role}</td>
                                <td>{item.lab}</td>
                                <td>{formatPeriod(item.start_date, item.end_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="form-group">
            <div className="category-header-row">
                <span />
                <button onClick={() => onChange([...items, { ...EMPTY }])} className="btn-add-project">+ Add Research</button>
            </div>
            {items.map((item, index) => (
                <div key={item.id || `new-${index}`} className="research-edit-card">
                    <div className="research-edit-head">
                        <h3 className="subsection-title">{item.title || 'New research entry'}</h3>
                        <div className="row-actions">
                            <button onClick={() => move(index, -1)} className="icon-btn" title="Move up" disabled={index === 0}>↑</button>
                            <button onClick={() => move(index, 1)} className="icon-btn" title="Move down" disabled={index === items.length - 1}>↓</button>
                            <button onClick={() => remove(index)} className="icon-btn danger" title="Delete">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="research-edit-grid">
                        {SHORT_FIELDS.map(({ key, label, placeholder }) => (
                            <label key={key} className="research-edit-field">
                                <span className="admin-label">{label}</span>
                                <input
                                    type="text"
                                    value={item[key] || ''}
                                    onChange={(e) => update(index, key, e.target.value)}
                                    className="table-input"
                                    placeholder={placeholder}
                                />
                            </label>
                        ))}
                    </div>
                    {LONG_FIELDS.map(({ key, label, placeholder }) => (
                        <label key={key} className="research-edit-field">
                            <span className="admin-label">{label}</span>
                            <textarea
                                value={item[key] || ''}
                                onChange={(e) => update(index, key, e.target.value)}
                                className="admin-textarea"
                                placeholder={placeholder}
                            />
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
}
