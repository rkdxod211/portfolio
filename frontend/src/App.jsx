import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Research from './pages/Research';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './style.css';
import { getToken, setToken } from './adminApi';
import { fetchAssets } from './siteAssets';

const initialDatabase = {
    about: {
        interests: '',
        tools: {}
    },
    experience: {
        clubs: [],
        work: []
    },
    contact: [],
    projects: [],
    research: [],
    education: []
};

// Research list, or [] if it can't be loaded so the rest of the site still renders.
async function fetchResearch() {
    try {
        const res = await fetch('/api/content/research');
        const data = res.ok ? await res.json() : [];
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState('portfolio'); 
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()));
    const [database, setDatabase] = useState(initialDatabase);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState(null); // server values { key: url | null }; null until loaded
    const ready = !loading && assets !== null;
    const scrollContainerRef = useRef(null);
    const pages = ['home', 'about', 'projects', 'research', 'experience', 'contact'];

    useEffect(() => {
        fetchAssets().then(setAssets);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const [aboutRes, experienceRes, contactRes, projectsRes, educationRes, research] = await Promise.all([
                    fetch('/api/content/about'),
                    fetch('/api/content/experience'),
                    fetch('/api/content/contact'),
                    fetch('/api/projects'),
                    fetch('/api/content/education'),
                    fetchResearch()
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
                    research,
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

        // The active section is the last one whose top has passed the middle of
        // the screen, so long sections (e.g. Research) stay active while reading them.
        const handleScroll = () => {
            const middle = container.scrollTop + container.clientHeight / 2;
            const sections = container.querySelectorAll('.page-section');
            let active = 0;
            sections.forEach((section, index) => {
                if (section.offsetTop <= middle) active = index;
            });
            setCurrentPage(active);
        };

        handleScroll();
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
        // `ready`: the scroll container only exists once the loading screen is gone.
    }, [viewMode, ready]);

    const scrollToPage = (pageIndex) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const sections = container.querySelectorAll('.page-section');
        if (sections[pageIndex]) {
            setCurrentPage(pageIndex);
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
        setToken(null);
        setIsAuthenticated(false);
        setViewMode('portfolio');
        setCurrentPage(0);
    };

    const handleBackToSite = async () => {
        try {
            const [aboutRes, experienceRes, contactRes, projectsRes, research] = await Promise.all([
                fetch('/api/content/about'),
                fetch('/api/content/experience'),
                fetch('/api/content/contact'),
                fetch('/api/projects'),
                fetchResearch()
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
                projects,
                research
            }));
        } catch (error) {
        }
        
        setViewMode('portfolio');
    };

    const handleUpdateDatabase = (newData) => {
        setDatabase(newData);
    };

    if (!ready) {
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
                assets={assets}
                onAssetsChange={setAssets}
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
                profileSrc={assets.profile || null}
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
                        <Research database={database} />
                        {currentPage === 3 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>
                    <div className="page-section">
                        <Experience database={database} resumeUrl={assets.resume || null} />
                        {currentPage === 4 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>
                    <div className="page-section">
                        <Contact database={database} onBackToTop={() => scrollToPage(0)} />
                    </div>
                </div>
            </div>
        </div>
    );
}