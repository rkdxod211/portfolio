import React, { useState } from 'react';
import { Edit2, Save, X, LogOut } from 'lucide-react';
import ProjectVisibility from '../components/ProjectVisibility';
import SiteAssets from '../components/SiteAssets';
import ResearchEditor from '../components/ResearchEditor';
import { TOOL_CATEGORIES } from './About';
import { formatPeriod } from '../format';
import { adminFetch } from '../adminApi';

export default function Admin({ database, assets, onAssetsChange, onUpdateDatabase, onLogout, onBackToSite }) {
    const [editMode, setEditMode] = useState({});
    const [editedData, setEditedData] = useState(database);

    const handleEdit = (section) => {
        setEditMode({ ...editMode, [section]: true });
    };

    const handleSave = async (section) => {
        try {
            
            if (section === 'about') {
                const response = await adminFetch('/api/content/about', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedData.about)
                });
                
                if (response.ok) {
                    onUpdateDatabase(editedData);
                    setEditMode({ ...editMode, [section]: false });
                    alert('SAVED');
                } else {
                    alert('ERROR');
                }
            } 
            else if (section === 'experience') {
                const [clubsRes, workRes] = await Promise.all([
                    putJson('/api/content/experience/clubs', { items: editedData.experience.clubs }),
                    putJson('/api/content/experience/work', { items: editedData.experience.work })
                ]);
                if (!clubsRes.ok || !workRes.ok) {
                    alert('ERROR');
                    return;
                }
                const updated = {
                    ...editedData,
                    experience: { ...editedData.experience, clubs: await clubsRes.json(), work: await workRes.json() }
                };
                setEditedData(updated);
                onUpdateDatabase(updated);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            }
            else if (section === 'research') {
                const response = await putJson('/api/content/research', { items: editedData.research || [] });
                if (!response.ok) {
                    alert('ERROR');
                    return;
                }
                const updated = { ...editedData, research: await response.json() };
                setEditedData(updated);
                onUpdateDatabase(updated);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            }
            else if (section === 'contact') {
                const response = await putJson('/api/content/contact', { items: editedData.contact });
                if (!response.ok) {
                    alert('ERROR');
                    return;
                }
                const updated = { ...editedData, contact: await response.json() };
                setEditedData(updated);
                onUpdateDatabase(updated);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            }
            else if (section === 'education') {
            for (const edu of editedData.education) {
                if (edu.id && edu.id > 0) {
                    await adminFetch(`/api/content/education/${edu.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(edu)
                    });
                } else {
                    const response = await adminFetch('/api/content/education', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(edu)
                    });
                    
                    if (response.ok) {
                        const newEdu = await response.json();
                        edu.id = newEdu.id;
                    }
                }
            }
            
            onUpdateDatabase(editedData);
            setEditMode({ ...editMode, [section]: false });
            alert('SAVED');
        }
            else {
                onUpdateDatabase(editedData);
                setEditMode({ ...editMode, [section]: false });
            }
            
        } catch (error) {
            alert('ERROR: ' + error.message);
        }
    };

    const handleCancel = (section) => {
        setEditedData({
            ...editedData,
            [section]: JSON.parse(JSON.stringify(database[section]))
        });
        setEditMode({ ...editMode, [section]: false });
    };
    const putJson = (url, body) => adminFetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    // Clubs / Work
    const setExpList = (key, list) => setEditedData(prev => ({
        ...prev,
        experience: { ...prev.experience, [key]: list }
    }));
    const updateExpItem = (key, index, field, value) =>
        setExpList(key, editedData.experience[key].map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    const addExpItem = (key) => setExpList(key, [...editedData.experience[key], { title: '', detail: '', start_date: '', end_date: '' }]);

    // About > Tools
    const tools = editedData.about.tools || {};
    const updateTool = (key, value) => setEditedData(prev => ({
        ...prev,
        about: { ...prev.about, tools: { ...(prev.about.tools || {}), [key]: value } }
    }));
    const removeExpItem = (key, index) => setExpList(key, editedData.experience[key].filter((_, i) => i !== index));

    // Contact
    const contactItems = Array.isArray(editedData.contact) ? editedData.contact : [];
    const setContact = (list) => setEditedData(prev => ({ ...prev, contact: list }));
    const updateContact = (index, field, value) =>
        setContact(contactItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    const addContact = () => setContact([...contactItems, { type: 'link', label: '', value: '' }]);
    const removeContact = (index) => setContact(contactItems.filter((_, i) => i !== index));
    const moveContact = (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= contactItems.length) return;
        const list = [...contactItems];
        [list[index], list[target]] = [list[target], list[index]];
        setContact(list);
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Admin Page</h1>
                <div className="admin-actions">
                    <button onClick={onBackToSite} className="btn-back">
                        Back to Site
                    </button>
                    <button onClick={onLogout} className="btn-logout">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            <SiteAssets assets={assets} onAssetsChange={onAssetsChange} />

            {/* About Section */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">About Section</h2>
                    {!editMode.about ? (
                        <button onClick={() => handleEdit('about')} className="btn-edit">
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={() => handleSave('about')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('about')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="admin-label">Interests</label>
                    {editMode.about ? (
                        <textarea
                            value={editedData.about.interests}
                            onChange={(e) => setEditedData({
                                ...editedData,
                                about: { ...editedData.about, interests: e.target.value }
                            })}
                            className="admin-textarea"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.about.interests}
                        </div>
                    )}
                </div>

                <h3 className="subsection-title">Tools</h3>
                {TOOL_CATEGORIES.map(({ key, label }) => (
                    <div className="form-group" key={key}>
                        <label className="admin-label">{label}</label>
                        {editMode.about ? (
                            <input
                                type="text"
                                value={tools[key] || ''}
                                onChange={(e) => updateTool(key, e.target.value)}
                                className="admin-input"
                                placeholder="Comma-separated, e.g. Python, Java"
                            />
                        ) : (
                            <div className="admin-display-box">{tools[key]}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Education Section</h2>
                    {!editMode.education ? (
                        <button onClick={() => handleEdit('education')} className="btn-edit">
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={() => handleSave('education')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('education')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Institution</th>
                                <th>Period</th>
                                <th>Degree</th>
                                <th>Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedData.education && editedData.education.map((edu, index) => (
                                <tr key={edu.id || index}>
                                    <td>
                                        {editMode.education ? (
                                            <input
                                                type="text"
                                                value={edu.institution}
                                                onChange={(e) => {
                                                    const newEducation = [...editedData.education];
                                                    newEducation[index].institution = e.target.value;
                                                    setEditedData({
                                                        ...editedData,
                                                        education: newEducation
                                                    });
                                                }}
                                                className="table-input"
                                            />
                                        ) : edu.institution}
                                    </td>
                                    <td>
                                        {editMode.education ? (
                                            <input
                                                type="text"
                                                value={edu.period}
                                                onChange={(e) => {
                                                    const newEducation = [...editedData.education];
                                                    newEducation[index].period = e.target.value;
                                                    setEditedData({
                                                        ...editedData,
                                                        education: newEducation
                                                    });
                                                }}
                                                className="table-input"
                                            />
                                        ) : edu.period}
                                    </td>
                                    <td>
                                        {editMode.education ? (
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => {
                                                    const newEducation = [...editedData.education];
                                                    newEducation[index].degree = e.target.value;
                                                    setEditedData({
                                                        ...editedData,
                                                        education: newEducation
                                                    });
                                                }}
                                                className="table-input"
                                            />
                                        ) : edu.degree}
                                    </td>
                                    <td>
                                        {editMode.education ? (
                                            <input
                                                type="number"
                                                value={edu.display_order}
                                                onChange={(e) => {
                                                    const newEducation = [...editedData.education];
                                                    newEducation[index].display_order = parseInt(e.target.value) || 0;
                                                    setEditedData({
                                                        ...editedData,
                                                        education: newEducation
                                                    });
                                                }}
                                                className="table-input"
                                                style={{ width: '80px' }}
                                            />
                                        ) : edu.display_order}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Research Section */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Research Section</h2>
                    {!editMode.research ? (
                        <button onClick={() => handleEdit('research')} className="btn-edit">
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={() => handleSave('research')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('research')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
                <ResearchEditor
                    items={Array.isArray(editedData.research) ? editedData.research : []}
                    editing={editMode.research}
                    onChange={(list) => setEditedData(prev => ({ ...prev, research: list }))}
                />
            </div>

            {/* Experience Section */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Experience Section</h2>
                    {!editMode.experience ? (
                        <button onClick={() => handleEdit('experience')} className="btn-edit">
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={() => handleSave('experience')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('experience')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <EntryTable
                    title="Clubs/Activities"
                    items={editedData.experience.clubs}
                    editing={editMode.experience}
                    onChange={(index, field, value) => updateExpItem('clubs', index, field, value)}
                    onAdd={() => addExpItem('clubs')}
                    onRemove={(index) => removeExpItem('clubs', index)}
                />

                <EntryTable
                    title="Work/Internship"
                    items={editedData.experience.work}
                    editing={editMode.experience}
                    onChange={(index, field, value) => updateExpItem('work', index, field, value)}
                    onAdd={() => addExpItem('work')}
                    onRemove={(index) => removeExpItem('work', index)}
                />
            </div>

            {/* Contact Section */}
            <div className="admin-section">
                <div className="section-header">
                    <h2 className="section-title">Contact Section</h2>
                    {!editMode.contact ? (
                        <button onClick={() => handleEdit('contact')} className="btn-edit">
                            <Edit2 size={16} /> Edit
                        </button>
                    ) : (
                        <div className="edit-actions">
                            <button onClick={() => handleSave('contact')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('contact')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    {editMode.contact && (
                        <div className="category-header-row">
                            <span />
                            <button onClick={addContact} className="btn-add-project">+ Add Contact</button>
                        </div>
                    )}
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Label</th>
                                    <th>Email / URL</th>
                                    {editMode.contact && <th className="row-actions-cell">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {contactItems.map((item, index) => (
                                    <tr key={item.id || `new-${index}`}>
                                        <td>
                                            {editMode.contact ? (
                                                <select
                                                    value={item.type}
                                                    onChange={(e) => updateContact(index, 'type', e.target.value)}
                                                    className="table-select"
                                                >
                                                    <option value="email">Email</option>
                                                    <option value="link">Link</option>
                                                </select>
                                            ) : (item.type === 'email' ? 'Email' : 'Link')}
                                        </td>
                                        <td>
                                            {editMode.contact ? (
                                                <input
                                                    type="text"
                                                    value={item.label}
                                                    onChange={(e) => updateContact(index, 'label', e.target.value)}
                                                    className="table-input"
                                                    placeholder={item.type === 'email' ? 'Email' : 'e.g. GITHUB'}
                                                />
                                            ) : item.label}
                                        </td>
                                        <td>
                                            {editMode.contact ? (
                                                <input
                                                    type={item.type === 'email' ? 'email' : 'url'}
                                                    value={item.value}
                                                    onChange={(e) => updateContact(index, 'value', e.target.value)}
                                                    className="table-input"
                                                    placeholder={item.type === 'email' ? 'you@example.com' : 'https://...'}
                                                />
                                            ) : item.value}
                                        </td>
                                        {editMode.contact && (
                                            <td className="row-actions-cell">
                                                <div className="row-actions">
                                                    <button onClick={() => moveContact(index, -1)} className="icon-btn" title="Move up" disabled={index === 0}>↑</button>
                                                    <button onClick={() => moveContact(index, 1)} className="icon-btn" title="Move down" disabled={index === contactItems.length - 1}>↓</button>
                                                    <button onClick={() => removeContact(index)} className="icon-btn danger" title="Delete">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ fontSize: '14px', marginTop: '10px', color: '#1d3557' }}>
                        Each entry becomes a card on the site. Emails get a copy button; links show their label and open in a new tab.
                    </p>
                </div>
            </div>

            <ProjectVisibility />
        </div>
    );
}

function EntryTable({ title, items, editing, onChange, onAdd, onRemove }) {
    return (
        <div className="form-group">
            <div className="category-header-row">
                <h3 className="subsection-title">{title}</h3>
                {editing && (
                    <button onClick={onAdd} className="btn-add-project">+ Add</button>
                )}
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Detail</th>
                            {editing ? (
                                <>
                                    <th className="date-cell">Start</th>
                                    <th className="date-cell">End</th>
                                </>
                            ) : <th>Dates</th>}
                            {editing && <th className="row-actions-cell">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id || `new-${index}`}>
                                <td>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => onChange(index, 'title', e.target.value)}
                                            className="table-input"
                                            placeholder="Title"
                                        />
                                    ) : item.title}
                                </td>
                                <td>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={item.detail}
                                            onChange={(e) => onChange(index, 'detail', e.target.value)}
                                            className="table-input"
                                            placeholder="Detail"
                                        />
                                    ) : item.detail}
                                </td>
                                {editing ? (
                                    <>
                                        <td className="date-cell">
                                            <input
                                                type="text"
                                                value={item.start_date || ''}
                                                onChange={(e) => onChange(index, 'start_date', e.target.value)}
                                                className="table-input"
                                                placeholder="e.g. Sep 2025"
                                            />
                                        </td>
                                        <td className="date-cell">
                                            <input
                                                type="text"
                                                value={item.end_date || ''}
                                                onChange={(e) => onChange(index, 'end_date', e.target.value)}
                                                className="table-input"
                                                placeholder="Blank = Present"
                                            />
                                        </td>
                                    </>
                                ) : <td>{formatPeriod(item.start_date, item.end_date)}</td>}
                                {editing && (
                                    <td className="row-actions-cell">
                                        <div className="row-actions">
                                            <button onClick={() => onRemove(index)} className="icon-btn danger" title="Delete">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
