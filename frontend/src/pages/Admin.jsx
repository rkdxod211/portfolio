import React, { useState } from 'react';
import { Edit2, Save, X, LogOut } from 'lucide-react';

export default function Admin({ database, onUpdateDatabase, onLogout, onBackToSite }) {
    const [editMode, setEditMode] = useState({});
    const [editedData, setEditedData] = useState(database);

    const handleEdit = (section) => {
        setEditMode({ ...editMode, [section]: true });
    };

    const handleSave = async (section) => {
        try {
            console.log(`💾 ${section} 저장 중...`);
            
            if (section === 'about') {
                const response = await fetch('/api/content/about', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedData.about)
                });
                
                if (response.ok) {
                    console.log('✅ About 저장 성공!');
                    onUpdateDatabase(editedData);
                    setEditMode({ ...editMode, [section]: false });
                    alert('SAVED');
                } else {
                    alert('ERROR');
                }
            } 
            else if (section === 'experience') {
                // Languages 업데이트
                await fetch('/api/content/experience/languages', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ languages: editedData.experience.languages })
                });
                
                // Clubs 업데이트
                for (const club of editedData.experience.clubs) {
                    if (club.id) {
                        await fetch(`/api/content/experience/clubs/${club.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(club)
                        });
                    }
                }
                
                // Work 업데이트
                for (const work of editedData.experience.work) {
                    if (work.id) {
                        await fetch(`/api/content/experience/work/${work.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(work)
                        });
                    }
                }
                
                console.log('✅ Experience 저장 성공!');
                onUpdateDatabase(editedData);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            } 
            else if (section === 'contact') {
                const response = await fetch('/api/content/contact', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedData.contact)
                });
                
                if (response.ok) {
                    console.log('✅ Contact 저장 성공!');
                    onUpdateDatabase(editedData);
                    setEditMode({ ...editMode, [section]: false });
                    alert('SAVED!');
                } else {
                    alert('ERROR');
                }
            }
            else if (section === 'education') {
            // Education 항목들 업데이트
            for (const edu of editedData.education) {
                if (edu.id && edu.id > 0) {
                    // 기존 항목 수정
                    await fetch(`/api/content/education/${edu.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(edu)
                    });
                } else {
                    // 새 항목 추가
                    const response = await fetch('/api/content/education', {
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
            
            console.log('✅ Education 저장 성공!');
            onUpdateDatabase(editedData);
            setEditMode({ ...editMode, [section]: false });
            alert('SAVED');
        }
            else if (section === 'projects') {
                // 각 카테고리의 프로젝트들을 처리
                for (const category in editedData.projects) {
                    for (const project of editedData.projects[category]) {
                        // id가 있고 0보다 크면 기존 프로젝트
                        if (project.id && project.id > 0) {
                            // 기존 프로젝트 수정
                            await fetch(`/api/projects/${project.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name: project.name,
                                    description: project.description,
                                    category: category,
                                    thumbnail: project.thumbnail,
                                    githubLink: project.githubLink,
                                    likes: project.likes,
                                    views: project.views,
                                    downloads: project.downloads
                                })
                            });
                        } else {
                            // 새 프로젝트 추가 (id가 0이거나 없는 경우)
                            const response = await fetch('/api/projects', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    name: project.name,
                                    description: project.description,
                                    category: category,
                                    thumbnail: project.thumbnail,
                                    githubLink: project.githubLink
                                })
                            });
                            
                            if (response.ok) {
                                const newProject = await response.json();
                                console.log(`✅ 새 프로젝트 추가됨: ID ${newProject.id}`);
                            }
                        }
                    }
                }
                
                const projectsResponse = await fetch('/api/projects');
                const freshProjects = await projectsResponse.json();
                
                const updatedData = {
                    ...editedData,
                    projects: freshProjects
                };
                setEditedData(updatedData);
                
                console.log('✅ Projects 저장 성공!');
                onUpdateDatabase(updatedData);
                setEditMode({ ...editMode, [section]: false });
                alert('SAVED');
            }
            else {
                onUpdateDatabase(editedData);
                setEditMode({ ...editMode, [section]: false });
            }
            
        } catch (error) {
            console.error('❌ 저장 실패:', error);
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

    const handleAddProject = (category) => {
        const newProjects = { ...editedData.projects };
        
        const newProject = {
            id: 0,  
            name: '',
            description: '',
            thumbnail: '',
            githubLink: '',
            likes: 0,
            views: 0,
            downloads: 0
        };

        newProjects[category].push(newProject);
        setEditedData({
            ...editedData,
            projects: newProjects
        });
    };

    const handleDeleteProject = async (category, index, projectName, projectId) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${projectName}"?\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            try {
                if (projectId && projectId > 0) {
                    const response = await fetch(`/api/projects/${projectId}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        throw new Error('삭제에 실패했습니다');
                    }
                    
                    console.log(`✅ 프로젝트 삭제 성공: ${projectName}`);
                }
                
                const newProjects = { ...editedData.projects };
                newProjects[category].splice(index, 1);
                setEditedData({
                    ...editedData,
                    projects: newProjects
                });
                
                alert('삭제되었습니다!');
            } catch (error) {
                console.error('❌ 삭제 실패:', error);
                alert('삭제에 실패했습니다: ' + error.message);
            }
        }
    };

    const validateAndSave = (section) => {
        if (section === 'projects') {
            let isValid = true;
            let errorMessage = '';

            Object.entries(editedData.projects).forEach(([category, projects]) => {
                projects.forEach((project, index) => {
                    if (!project.name || !project.description || !project.thumbnail) {
                        isValid = false;
                        errorMessage = `Project ${index + 1} in ${category} category is missing required fields (Name, Description, or Thumbnail URL).`;
                    }
                    if (project.likes === '' || project.views === '' || project.downloads === '') {
                        isValid = false;
                        errorMessage = `Project ${index + 1} in ${category} category must have values for Likes, Views, and Downloads (can be 0).`;
                    }
                });
            });

            if (!isValid) {
                alert(errorMessage);
                return;
            }
        }

        handleSave(section);
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
                            <button onClick={() => validateAndSave('projects')} className="btn-save">
                                <Save size={16} /> Save
                            </button>
                            <button onClick={() => handleCancel('projects')} className="btn-cancel">
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    )}
                </div>
                {['Web', 'App', 'Game', 'ETC']
                    .filter(category => editedData.projects[category]) // 존재하는 카테고리만
                    .map((category) => (
                    <div key={category} className="form-group">
                        <div className="category-header-row">
                            <h3 className="subsection-title">{category}</h3>
                            {editMode.projects && (
                                <button 
                                    onClick={() => handleAddProject(category)} 
                                    className="btn-add-project"
                                >
                                    + Add Project
                                </button>
                            )}
                        </div>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Thumbnail URL</th>
                                        <th>GitHub Link</th>
                                        <th>Likes</th>
                                        <th>Views</th>
                                        <th>Downloads</th>
                                        {editMode.projects && <th>Actions</th>}
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
                                                        required
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
                                                        required
                                                    />
                                                ) : project.description}
                                            </td>
                                            <td>
                                                {editMode.projects ? (
                                                    <input
                                                        type="text"
                                                        value={project.thumbnail}
                                                        onChange={(e) => {
                                                            const newProjects = { ...editedData.projects };
                                                            newProjects[category][index].thumbnail = e.target.value;
                                                            setEditedData({
                                                                ...editedData,
                                                                projects: newProjects
                                                            });
                                                        }}
                                                        className="table-input"
                                                        placeholder="Image URL"
                                                        required
                                                    />
                                                ) : project.thumbnail}
                                            </td>
                                            <td>
                                                {editMode.projects ? (
                                                    <input
                                                        type="url"
                                                        value={project.githubLink || ''}
                                                        onChange={(e) => {
                                                            const newProjects = { ...editedData.projects };
                                                            newProjects[category][index].githubLink = e.target.value;
                                                            setEditedData({
                                                                ...editedData,
                                                                projects: newProjects
                                                            });
                                                        }}
                                                        className="table-input"
                                                        placeholder="GitHub URL (optional)"
                                                    />
                                                ) : (project.githubLink || 'N/A')}
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
                                                        required
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
                                                        required
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
                                                        required
                                                    />
                                                ) : project.downloads}
                                            </td>
                                            {editMode.projects && (
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteProject(category, index, project.name, project.id)}
                                                        className="btn-delete-project"
                                                        title="Delete Project"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}