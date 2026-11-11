import React, { useState } from 'react';
import { Edit2, Save, X, LogOut } from 'lucide-react';
import ProjectVisibility from '../components/ProjectVisibility';
import { adminFetch } from '../adminApi';

export default function Admin({ database, onUpdateDatabase, onLogout, onBackToSite }) {
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
                await adminFetch('/api/content/experience/languages', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ languages: editedData.experience.languages })
                });
                
                for (const club of editedData.experience.clubs) {
                    if (club.id) {
                        await adminFetch(`/api/content/experience/clubs/${club.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(club)
                        });
                    }
                }
                
                for (const work of editedData.experience.work) {
                    if (work.id) {
                        await adminFetch(`/api/content/experience/work/${work.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(work)
                        });
                    }
                }
                
                onUpdateDatabase(editedData);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            } 
            else if (section === 'contact') {
                const response = await adminFetch('/api/content/contact', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedData.contact)
                });
                
                if (response.ok) {
                    onUpdateDatabase(editedData);
                    setEditMode({ ...editMode, [section]: false });
                    alert('SAVED!');
                } else {
                    alert('ERROR');
                }
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
    const handleUpdateClub = (index, field, value) => {
        const newClubs = [...editedData.experience.clubs];
        newClubs[index][field] = value;
        setEditedData({
            ...editedData,
            experience: { ...editedData.experience, clubs: newClubs }
        });
    };

    const handleUpdateWork = (index, field, value) => {
        const newWork = [...editedData.experience.work];
        newWork[index][field] = value;
        setEditedData({
            ...editedData,
            experience: { ...editedData.experience, work: newWork }
        });
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
                    <label className="admin-label">Introduction</label>
                    {editMode.about ? (
                        <textarea
                            value={editedData.about.introduction}
                            onChange={(e) => setEditedData({
                                ...editedData,
                                about: { ...editedData.about, introduction: e.target.value }
                            })}
                            className="admin-textarea"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.about.introduction}
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

                <div className="form-group">
                    <label className="admin-label">Languages</label>
                    {editMode.experience ? (
                        <input
                            type="text"
                            value={editedData.experience.languages}
                            onChange={(e) => setEditedData({
                                ...editedData,
                                experience: { ...editedData.experience, languages: e.target.value }
                            })}
                            className="admin-input"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.experience.languages}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <h3 className="subsection-title">Clubs/Activities</h3>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editedData.experience.clubs.map((club, index) => (
                                    <tr key={index}>
                                        <td>
                                            {editMode.experience ? (
                                                <input
                                                    type="text"
                                                    value={club.title}
                                                    onChange={(e) => handleUpdateClub(index, 'title', e.target.value)}
                                                    className="table-input"
                                                />
                                            ) : club.title}
                                        </td>
                                        <td>
                                            {editMode.experience ? (
                                                <input
                                                    type="text"
                                                    value={club.detail}
                                                    onChange={(e) => handleUpdateClub(index, 'detail', e.target.value)}
                                                    className="table-input"
                                                />
                                            ) : club.detail}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="form-group">
                    <h3 className="subsection-title">Work/Internship</h3>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editedData.experience.work.map((work, index) => (
                                    <tr key={index}>
                                        <td>
                                            {editMode.experience ? (
                                                <input
                                                    type="text"
                                                    value={work.title}
                                                    onChange={(e) => handleUpdateWork(index, 'title', e.target.value)}
                                                    className="table-input"
                                                />
                                            ) : work.title}
                                        </td>
                                        <td>
                                            {editMode.experience ? (
                                                <input
                                                    type="text"
                                                    value={work.detail}
                                                    onChange={(e) => handleUpdateWork(index, 'detail', e.target.value)}
                                                    className="table-input"
                                                />
                                            ) : work.detail}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                    <label className="admin-label">Email 1</label>
                    {editMode.contact ? (
                        <input
                            type="email"
                            value={editedData.contact.emails[0]}
                            onChange={(e) => {
                                const newEmails = [...editedData.contact.emails];
                                newEmails[0] = e.target.value;
                                setEditedData({
                                    ...editedData,
                                    contact: { ...editedData.contact, emails: newEmails }
                                });
                            }}
                            className="admin-input"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.contact.emails[0]}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="admin-label">Email 2</label>
                    {editMode.contact ? (
                        <input
                            type="email"
                            value={editedData.contact.emails[1]}
                            onChange={(e) => {
                                const newEmails = [...editedData.contact.emails];
                                newEmails[1] = e.target.value;
                                setEditedData({
                                    ...editedData,
                                    contact: { ...editedData.contact, emails: newEmails }
                                });
                            }}
                            className="admin-input"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.contact.emails[1]}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="admin-label">GitHub URL</label>
                    {editMode.contact ? (
                        <input
                            type="url"
                            value={editedData.contact.github}
                            onChange={(e) => setEditedData({
                                ...editedData,
                                contact: { ...editedData.contact, github: e.target.value }
                            })}
                            className="admin-input"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.contact.github}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label className="admin-label">LinkedIn URL</label>
                    {editMode.contact ? (
                        <input
                            type="url"
                            value={editedData.contact.linkedin}
                            onChange={(e) => setEditedData({
                                ...editedData,
                                contact: { ...editedData.contact, linkedin: e.target.value }
                            })}
                            className="admin-input"
                        />
                    ) : (
                        <div className="admin-display-box">
                            {editedData.contact.linkedin}
                        </div>
                    )}
                </div>
            </div>

            <ProjectVisibility />
        </div>
    );
}