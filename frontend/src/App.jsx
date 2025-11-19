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
        'Web': [
            { 
                id: 1, 
                name: 'Personal Portfolio Website', 
                thumbnail: '/images/web_portfolio.png', 
                description: 'description', 
                likes: 10, 
                views: 10, 
                downloads: 10,
                githubLink: 'https://github.com/rkdxod211/portfolio'
            },
            { 
                id: 2, 
                name: 'Project 2', 
                thumbnail: '/images', 
                description: 'web2', 
                likes: 10, 
                views: 10, 
                downloads: 10,
                githubLink: 'https://github.com/rkdxod211'
            }
        ],
        'App': [
            { 
                id: 3, 
                name: 'Project 3', 
                thumbnail: '/images', 
                description: 'app1', 
                likes: 10, 
                views: 10, 
                downloads: 10,
                githubLink: 'https://github.com/rkdxod211'
            }
        ],
        'Game': [
            { 
                id: 4, 
                name: 'Project 4', 
                thumbnail: '/images', 
                description: 'game1', 
                likes: 10, 
                views: 10, 
                downloads: 10,
                githubLink: 'https://github.com/rkdxod211'
            }
        ],
        'ETC': [
            { 
                id: 5, 
                name: 'Project 5', 
                thumbnail: '/api/placeholder/250/150', 
                description: 'etc1', 
                likes: 10, 
                views: 10, 
                downloads: 10,
                githubLink: ''
            }
        ],
    }
};

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState('portfolio'); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [database, setDatabase] = useState(initialDatabase);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const pages = ['home', 'about', 'projects', 'experience', 'contact'];

    // 백엔드에서 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔄 백엔드에서 데이터를 가져오는 중...');
                
                // About, Experience, Contact 데이터 가져오기
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

                console.log('✅ About:', about);
                console.log('✅ Experience:', experience);
                console.log('✅ Contact:', contact);
                console.log('✅ Projects:', projects);

                // 기존 database에 백엔드 데이터 합치기
                setDatabase(prevDatabase => ({
                    ...prevDatabase,
                    about,
                    experience,
                    contact,
                    projects
                }));

                setLoading(false);
            } catch (error) {
                console.error('❌ 데이터 가져오기 실패:', error);
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
        // Admin에서 변경한 내용을 반영하기 위해 데이터 다시 가져오기
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
            console.error('❌ 데이터 새로고침 실패:', error);
        }
        
        setViewMode('portfolio');
    };

    const handleUpdateDatabase = (newData) => {
        setDatabase(newData);
    };

    // 로딩 중일 때
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