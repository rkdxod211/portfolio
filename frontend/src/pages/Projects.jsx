import React, { useState } from "react";
import { Heart, Eye, Download, Grid3x3, List, FileText, Github, ArrowLeft } from 'lucide-react';

export default function Projects({ database }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [viewMode, setViewMode] = useState("tile"); 
    const [likedProjects, setLikedProjects] = useState({});
    const [projectStats, setProjectStats] = useState({});

    const toggleLike = async (projectId, event) => {
        if (event) {
            event.stopPropagation();
        }
        
        const isCurrentlyLiked = likedProjects[projectId];
        
        // 이미 좋아요를 눌렀으면 취소만 (백엔드는 호출 안 함)
        if (isCurrentlyLiked) {
            setLikedProjects(prev => ({
                ...prev,
                [projectId]: false
            }));
            return;
        }
        
        // 좋아요 추가
        setLikedProjects(prev => ({
            ...prev,
            [projectId]: true
        }));
        
        // 백엔드에 좋아요 증가 요청
        try {
            const response = await fetch(`/api/projects/${projectId}/like`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 프로젝트 ${projectId} 좋아요: ${data.likes}`);
                
                // 로컬 상태 업데이트
                setProjectStats(prev => ({
                    ...prev,
                    [projectId]: { ...prev[projectId], likes: data.likes }
                }));
            }
        } catch (error) {
            console.error('❌ 좋아요 증가 실패:', error);
        }
    };

    const handleProjectClick = async (project) => {
        setSelectedProject(project);
        
        // 조회수 증가
        try {
            const response = await fetch(`/api/projects/${project.id}/view`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 프로젝트 ${project.name} 조회수: ${data.views}`);
                
                // 로컬 상태 업데이트
                setProjectStats(prev => ({
                    ...prev,
                    [project.id]: { ...prev[project.id], views: data.views }
                }));
            }
        } catch (error) {
            console.error('❌ 조회수 증가 실패:', error);
        }
    };

    const handleBackToList = () => {
        setSelectedProject(null);
    };

    const handleDownload = async (projectName, projectId) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/download`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 프로젝트 ${projectName} 다운로드: ${data.downloads}`);
                
                // 로컬 상태 업데이트
                setProjectStats(prev => ({
                    ...prev,
                    [projectId]: { ...prev[projectId], downloads: data.downloads }
                }));
            }
        } catch (error) {
            console.error('❌ 다운로드 증가 실패:', error);
        }
        
        alert(`Downloaded ${projectName}`);
    };

    // 프로젝트의 최신 통계 가져오기
    const getProjectStats = (project) => {
        const stats = projectStats[project.id] || {};
        return {
            // 백엔드에서 업데이트된 값이 있으면 그걸 사용, 없으면 원본 사용
            likes: stats.likes !== undefined ? stats.likes : project.likes,
            views: stats.views !== undefined ? stats.views : project.views,
            downloads: stats.downloads !== undefined ? stats.downloads : project.downloads
        };
    };

    if (selectedProject) {
        const stats = getProjectStats(selectedProject);
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
                                    <span>{stats.likes} Likes</span>
                                </div>
                                <div className="detail-stat-item">
                                    <Eye size={24} />
                                    <span>{stats.views} Views</span>
                                </div>
                                <div className="detail-stat-item">
                                    <Download size={24} />
                                    <span>{stats.downloads} Downloads</span>
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
                                    onClick={() => handleDownload(selectedProject.name, selectedProject.id)}
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
        
        return projects.map((project) => {
            const stats = getProjectStats(project); 
            
            return (
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
                                onClick={(e) => toggleLike(project.id, e)}
                            >
                                <Heart 
                                    size={16} 
                                    fill={likedProjects[project.id] ? 'currentColor' : 'none'} 
                                />
                            </button>
                            <span>{stats.likes}</span>
                        </div>
                        <div className="stat-item">
                            <Eye size={16} />
                            <span>{stats.views}</span>
                        </div>
                        <div className="stat-item">
                            <Download size={16} />
                            <span>{stats.downloads}</span>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div>
            <h1>PROJECTS</h1>
            
            <div className="project-categories">
                {['Web', 'App', 'Game', 'ETC'].filter(cat => database.projects[cat]).map((cat) => (
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