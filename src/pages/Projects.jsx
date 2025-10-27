import React, { useState } from "react";
import { Heart, Eye, Download, Grid3x3, List, FileText } from 'lucide-react';
import { projectsData } from "../data/projectsData";

export default function Projects() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [viewMode, setViewMode] = useState("tile"); 
    const [likedProjects, setLikedProjects] = useState({});

    const toggleLike = (projectId) => {
        setLikedProjects(prev => ({
        ...prev,
        [projectId]: !prev[projectId]
        }));
    };

    const renderProjects = () => {
        if (!selectedCategory) return null;
        const projects = projectsData[selectedCategory] || [];
        
        return projects.map((project) => (
        <div key={project.id} className="project-card">
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
            
            {/* Project Stats */}
            <div className="project-stats">
            <div className="stat-item">
                <button 
                className={`like-btn ${likedProjects[project.id] ? 'liked' : ''}`}
                onClick={() => toggleLike(project.id)}
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
        
        {/* Category Selection */}
        <div className="project-categories">
            {Object.keys(projectsData).map((cat) => (
            <div 
                key={cat} 
                className="category-item" 
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
                <div className={`folder-icon ${selectedCategory === cat ? 'active' : ''}`}>
                <FileText size={48} color="white" />
                <div className="category-count">
                    {projectsData[cat].length}
                </div>
                </div>
                <h3>{cat}</h3>
            </div>
            ))}
        </div>

        {/* Projects Display */}
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
