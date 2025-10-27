import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './style.css';

// Database state - would be in a real backend in production
const initialDatabase = {
  admin: {
    username: 'admin',
    password: 'password123'
  },
  about: {
    introduction: 'add later',
    interests: 'add later'
  },
  experience: {
    languages: 'Python • Java • HTML/CSS • Javascript',
    clubs: [
      { title: 'Club 1', detail: 'Member' },
      { title: 'Activity 1', detail: 'Participant' }
    ],
    work: [
      { title: 'Work 1', detail: 'Company Name (when)' },
      { title: 'Intership 1', detail: 'Company Name (when)' }
    ]
  },
  contact: {
    emails: ['tkang55@wisc.edu', 'taeyoung070211@gmail.com'],
    github: 'https://github.com/rkdxod211',
    linkedin: 'https://www.linkedin.com/in/taeyoung-kang/'
  },
  projects: {
    'Web Development': [
      { id: 1, name: 'Project 1', thumbnail: '/api/placeholder/250/150', description: 'A web project', likes: 10, views: 100, downloads: 5 },
      { id: 2, name: 'Project 2', thumbnail: '/api/placeholder/250/150', description: 'Another web project', likes: 15, views: 150, downloads: 8 }
    ],
    'Data Science': [
      { id: 3, name: 'Project 3', thumbnail: '/api/placeholder/250/150', description: 'A data project', likes: 20, views: 200, downloads: 12 }
    ],
    'Mobile Apps': [
      { id: 4, name: 'Project 4', thumbnail: '/api/placeholder/250/150', description: 'A mobile app', likes: 25, views: 250, downloads: 15 }
    ]
  }
};

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState('portfolio'); // 'portfolio', 'login', 'admin'
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [database, setDatabase] = useState(initialDatabase);
    
    const scrollContainerRef = useRef(null);
    const pages = ['home', 'about', 'projects', 'experience', 'contact'];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || viewMode !== 'portfolio') return;
        
        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const viewportHeight = container.clientHeight;
            
            const sections = document.querySelectorAll('.page-section');
            let closestPage = 0;
            let closestDistance = Infinity;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const distanceFromCenter = Math.abs(sectionTop - (scrollPosition + viewportHeight / 2));
                
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestPage = index;
                }
            });
            
            setCurrentPage(closestPage);
        };
        
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [viewMode]);

    const scrollToPage = (pageIndex) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const sections = document.querySelectorAll('.page-section');
        if (sections[pageIndex]) {
            const targetSection = sections[pageIndex];
            container.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    const scrollToNext = () => {
        if (currentPage < pages.length - 1) {
            scrollToPage(currentPage + 1);
        }
    };

    const handleAdminClick = () => {
        if (isAuthenticated) {
            setViewMode('admin');
        } else {
            setViewMode('login');
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setViewMode('admin');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setViewMode('portfolio');
        setCurrentPage(0);
    };

    const handleBackToSite = () => {
        setViewMode('portfolio');
    };

    const handleUpdateDatabase = (newData) => {
        setDatabase(newData);
    };

    // Login view
    if (viewMode === 'login') {
        return <Login onLogin={handleLogin} adminCredentials={database.admin} onClose={handleBackToSite} />;
    }

    // Admin view
    if (viewMode === 'admin') {
        return (
            <Admin 
                database={database} 
                onUpdateDatabase={handleUpdateDatabase}
                onLogout={handleLogout}
                onBackToSite={handleBackToSite}
            />
        );
    }

    // Portfolio view
    return (
        <div className="app-container">
            <Sidebar 
                currentPage={currentPage} 
                scrollToPage={scrollToPage}
                pages={pages}
                onAdminClick={handleAdminClick}
            />
            
            <div className="main-content">
                <div className="scroll-container" ref={scrollContainerRef}>
                    <div className="page-section">
                        <Home />
                        {currentPage === 0 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <About database={database} />
                        {currentPage === 1 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Projects database={database} />
                        {currentPage === 2 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Experience database={database} />
                        {currentPage === 3 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Contact database={database} />
                        {currentPage === 4 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
