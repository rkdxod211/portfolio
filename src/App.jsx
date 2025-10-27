import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import './style.css';

export default function App() {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollContainerRef = useRef(null);
    const pages = ['home', 'about', 'projects', 'experience', 'contact'];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const handleScroll = () => {
            const scrollPosition = container.scrollTop;
            const viewportHeight = container.clientHeight;
            
            // 각 섹션의 시작점 계산
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
    }, []);

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

    return (
        <div className="app-container">
            <Sidebar 
                currentPage={currentPage} 
                scrollToPage={scrollToPage}
                pages={pages}
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
                        <About />
                        {currentPage === 1 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Projects />
                        {currentPage === 2 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Experience />
                        {currentPage === 3 && (
                            <div className="scroll-indicator" onClick={scrollToNext}>
                                <span style={{ fontSize: '48px' }}>⌄</span>
                            </div>
                        )}
                    </div>

                    <div className="page-section">
                        <Contact />
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