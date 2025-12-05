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

const initialDatabase = {
    admin: {
        username: 'aaa',
        password: '123123'
    },
    about: {
        introduction: '',
        interests: ''
    },
    experience: {
        languages: '',
        clubs: [],
        work: []
    },
    contact: {
        emails: ['', ''],
        github: '',
        linkedin: ''
    },
    projects: {
        Web: [],
        App: [],
        Game: [],
        ETC: []
    },
    education: []
};

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState('portfolio'); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [database, setDatabase] = useState(initialDatabase);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const pages = ['home', 'about', 'projects', 'experience', 'contact'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [aboutRes, experienceRes, contactRes, projectsRes, educationRes] = await Promise.all([
                    fetch('/api/content/about'),
                    fetch('/api/content/experience'),
                    fetch('/api/content/contact'),
                    fetch('/api/projects'),
                    fetch('/api/content/education')
                ]);

                const about = await aboutRes.json();
                const experience = await experienceRes.json();
                const contact = await contactRes.json();
                const projects = await projectsRes.json();
                const education = await educationRes.json();

                setDatabase(prevDatabase => ({
                    ...prevDatabase,
                    about,
                    experience,
                    contact,
                    projects,
                    education
                }));

                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const handleBackToSite = async () => {
        try {
            const [aboutRes, experienceRes, contactRes, projectsRes] = await Promise.all([
                fetch('/api/content/about'),
                fetch('/api/content/experience'),
                fetch('/api/content/contact'),
                fetch('/api/projects')
            ]);

            const about = await aboutRes.json();
            const experience = await experienceRes.json();
            const contact = await contactRes.json();
            const projects = await projectsRes.json();

            setDatabase(prevDatabase => ({
                ...prevDatabase,
                about,
                experience,
                contact,
                projects
            }));
        } catch (error) {
        }
        
        setViewMode('portfolio');
    };

    const handleUpdateDatabase = (newData) => {
        setDatabase(newData);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '32px',
                color: 'white',
                fontFamily: 'Exo 2'
            }}>
                Loading...
            </div>
        );
    }
    if (viewMode === 'login') {
        return <Login onLogin={handleLogin} onClose={handleBackToSite} />;
    }

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