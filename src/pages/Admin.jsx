import React, { useState } from 'react';
import { Edit2, Save, X, LogOut } from 'lucide-react';

export default function Admin({ database, onUpdateDatabase, onLogout, onBackToSite }) {
    const [editMode, setEditMode] = useState({});
    const [editedData, setEditedData] = useState(database);

    const handleEdit = (section) => {
        setEditMode({ ...editMode, [section]: true });
    };

    const handleSave = (section) => {
        onUpdateDatabase(editedData);
        setEditMode({ ...editMode, [section]: false });
    };

    const handleCancel = (section) => {
        setEditedData(database);
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

            {/* Projects Section */}
            <div className="admin-section">
            <div className="section-header">
                <h2 className="section-title">Projects Section</h2>
                {!editMode.projects ? (
                <button onClick={() => handleEdit('projects')} className="btn-edit">
                    <Edit2 size={16} /> Edit
                </button>
                ) : (
                <div className="edit-actions">
                    <button onClick={() => handleSave('projects')} className="btn-save">
                    <Save size={16} /> Save
                    </button>
                    <button onClick={() => handleCancel('projects')} className="btn-cancel">
                    <X size={16} /> Cancel
                    </button>
                </div>
                )}
            </div>

            {Object.keys(editedData.projects).map((category) => (
                <div key={category} className="form-group">
                <h3 className="subsection-title">{category}</h3>
                <div className="admin-table-container">
                    <table className="admin-table">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Likes</th>
                        <th>Views</th>
                        <th>Downloads</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editedData.projects[category].map((project, index) => (
                        <tr key={project.id}>
                            <td>
                            {editMode.projects ? (
                                <input
                                type="text"
                                value={project.name}
                                onChange={(e) => {
                                    const newProjects = { ...editedData.projects };
                                    newProjects[category][index].name = e.target.value;
                                    setEditedData({
                                    ...editedData,
                                    projects: newProjects
                                    });
                                }}
                                className="table-input"
                                />
                            ) : project.name}
                            </td>
                            <td>
                            {editMode.projects ? (
                                <input
                                type="text"
                                value={project.description}
                                onChange={(e) => {
                                    const newProjects = { ...editedData.projects };
                                    newProjects[category][index].description = e.target.value;
                                    setEditedData({
                                    ...editedData,
                                    projects: newProjects
                                    });
                                }}
                                className="table-input"
                                />
                            ) : project.description}
                            </td>
                            <td>
                            {editMode.projects ? (
                                <input
                                type="number"
                                value={project.likes}
                                onChange={(e) => {
                                    const newProjects = { ...editedData.projects };
                                    newProjects[category][index].likes = parseInt(e.target.value) || 0;
                                    setEditedData({
                                    ...editedData,
                                    projects: newProjects
                                    });
                                }}
                                className="table-input"
                                style={{ width: '80px' }}
                                />
                            ) : project.likes}
                            </td>
                            <td>
                            {editMode.projects ? (
                                <input
                                type="number"
                                value={project.views}
                                onChange={(e) => {
                                    const newProjects = { ...editedData.projects };
                                    newProjects[category][index].views = parseInt(e.target.value) || 0;
                                    setEditedData({
                                    ...editedData,
                                    projects: newProjects
                                    });
                                }}
                                className="table-input"
                                style={{ width: '80px' }}
                                />
                            ) : project.views}
                            </td>
                            <td>
                            {editMode.projects ? (
                                <input
                                type="number"
                                value={project.downloads}
                                onChange={(e) => {
                                    const newProjects = { ...editedData.projects };
                                    newProjects[category][index].downloads = parseInt(e.target.value) || 0;
                                    setEditedData({
                                    ...editedData,
                                    projects: newProjects
                                    });
                                }}
                                className="table-input"
                                style={{ width: '80px' }}
                                />
                            ) : project.downloads}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}
