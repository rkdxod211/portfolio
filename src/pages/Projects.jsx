import React, { useState } from "react";
import { Heart, Eye, Download, Grid3x3, List, FileText, Github, ArrowLeft } from 'lucide-react';

export default function Projects({ database }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [viewMode, setViewMode] = useState("tile"); 
    const [likedProjects, setLikedProjects] = useState({});

    const toggleLike = (projectId) => {
        setLikedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleBackToList = () => {
        setSelectedProject(null);
    };

    const handleDownload = (projectName) => {
        // Placeholder for download functionality
        alert(`Download functionality for ${projectName} will be implemented with backend`);
    };

    // If a specific project is selected, show detailed view
    if (selectedProject) {
        return (
            <div>
                <button onClick={handleBackToList} className="back-to-list-btn">
                    <ArrowLeft size={20} />
                    Back to Projects
                </button>

                <div className="project-detail-container">
                    <div className="project-detail-header">
                        <h1>{selectedProject.name}</h1>
                    </div>

                    <div className="project-detail-content">
                        <div className="project-detail-image">
                            <img 
                                src={selectedProject.thumbnail} 
                                alt={selectedProject.name}
                            />
                        </div>

                        <div className="project-detail-info">
                            <div className="project-detail-section">
                                <h3>Description</h3>
                                <p>{selectedProject.description}</p>
                            </div>

                            <div className="project-detail-stats">
                                <div className="detail-stat-item">
                                    <button 
                                        className={`like-btn ${likedProjects[selectedProject.id] ? 'liked' : ''}`}
                                        onClick={() => toggleLike(selectedProject.id)}
                                    >
                                        <Heart 
                                            size={24} 
                                            fill={likedProjects[selectedProject.id] ? 'currentColor' : 'none'} 
                                        />
                                    </button>
                                    <span>{selectedProject.likes + (likedProjects[selectedProject.id] ? 1 : 0)} Likes</span>
                                </div>
                                <div className="detail-stat-item">
                                    <Eye size={24} />
                                    <span>{selectedProject.views} Views</span>
                                </div>
                                <div className="detail-stat-item">
                                    <Download size={24} />
                                    <span>{selectedProject.downloads} Downloads</span>
                                </div>
                            </div>

                            <div className="project-detail-actions">
                                {selectedProject.githubLink && (
                                    <a 
                                        href={selectedProject.githubLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="project-action-btn github-btn"
                                    >
                                        <Github size={20} />
                                        View on GitHub
                                    </a>
                                )}
                                <button 
                                    onClick={() => handleDownload(selectedProject.name)}
                                    className="project-action-btn download-btn"
                                >
                                    <Download size={20} />
                                    Download Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderProjects = () => {
        if (!selectedCategory) return null;
        const projects = database.projects[selectedCategory] || [];
        
        return projects.map((project) => (
            <div 
                key={project.id} 
                className="project-card"
                onClick={() => handleProjectClick(project)}
            >
                {viewMode === 'tile' && (
                    <img 
                        src={project.thumbnail} 
                        alt={project.name} 
                        className="project-thumbnail"
                    />
                )}
                <h3 style={{ fontSize: '24px', color: 'white', margin: '10px 0' }}>
                    {project.name}
                </h3>
                {viewMode === 'tile' && project.description && (
                    <p style={{ 
                        fontSize: '16px', 
                        color: 'rgba(255,255,255,0.8)', 
                        margin: '10px 0',
                        lineHeight: '1.4'
                    }}>
                        {project.description}
                    </p>
                )}
                
                <div className="project-stats">
                    <div className="stat-item">
                        <button 
                            className={`like-btn ${likedProjects[project.id] ? 'liked' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(project.id);
                            }}
                        >
                            <Heart 
                                size={16} 
                                fill={likedProjects[project.id] ? 'currentColor' : 'none'} 
                            />
                        </button>
                        <span>{project.likes + (likedProjects[project.id] ? 1 : 0)}</span>
                    </div>
                    <div className="stat-item">
                        <Eye size={16} />
                        <span>{project.views}</span>
                    </div>
                    <div className="stat-item">
                        <Download size={16} />
                        <span>{project.downloads}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <h1>PROJECTS</h1>
            
            <div className="project-categories">
                {Object.keys(database.projects).map((cat) => (
                    <div 
                        key={cat} 
                        className="category-item" 
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    >
                        <div className={`folder-icon ${selectedCategory === cat ? 'active' : ''}`}>
                            <FileText size={48} color="white" />
                            <div className="category-count">
                                {database.projects[cat].length}
                            </div>
                        </div>
                        <h3>{cat}</h3>
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <>
                    <div className="view-controls">
                        <h2>VIEW MY PROJECTS</h2>
                        <div className="view-toggle">
                            <button 
                                className={`view-btn ${viewMode === 'tile' ? 'active' : ''}`}
                                onClick={() => setViewMode('tile')}
                            >
                                <Grid3x3 size={24} color="white" />
                            </button>
                            <button 
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={24} color="white" />
                            </button>
                        </div>
                    </div>
                    
                    <div className={viewMode === 'tile' ? 'projects-grid' : 'projects-list'}>
                        {renderProjects()}
                    </div>
                </>
            )}
        </div>
    );
}