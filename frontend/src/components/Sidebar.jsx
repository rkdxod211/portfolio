import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import "../style.css";

export default function Sidebar({ currentPage, scrollToPage, pages, onAdminClick }) {
    const [visitorCount, setVisitorCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const incrementVisitor = async () => {
            try {
                const response = await fetch('/api/visitors/increment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setVisitorCount(data.count);
                setLoading(false);
            } catch (error) {
                
                // Fallback: localStorage
                let count = parseInt(localStorage.getItem('portfolioVisitors')) || 0;
                const lastVisit = localStorage.getItem('lastVisitDate');
                const today = new Date().toDateString();
                
                if (lastVisit !== today) {
                    count += 1;
                    localStorage.setItem('portfolioVisitors', count.toString());
                    localStorage.setItem('lastVisitDate', today);
                }
                
                setVisitorCount(count);
                setLoading(false);
            }
        };

        // 세션 내에서 한 번만 호출
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
            incrementVisitor();
            sessionStorage.setItem('hasVisited', 'true');
        } else {
            // 이미 방문한 경우 total만 가져오기
            fetch('/api/visitors/total')
                .then(res => res.json())
                .then(data => {
                    setVisitorCount(data.total || 0);
                    setLoading(false);
                })
                .catch(err => {
                    setVisitorCount(0);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div className="sidebar">
            <button onClick={onAdminClick} className="admin-button">
                <Lock size={16} />
                Admin
            </button>
            <img src="/images/pp.jpg" alt="Profile" className="profile-img" />
            <nav>
                {pages.map((page, index) => (
                    <div
                        key={page}
                        className={`nav-link ${currentPage === index ? 'active' : ''}`}
                        onClick={() => scrollToPage(index)}
                    >
                        {page === 'home' ? 'HOME' :
                        page === 'about' ? 'ABOUT ME' :
                        page === 'projects' ? 'PROJECTS' :
                        page === 'experience' ? 'EXPERIENCE' :
                        'CONTACT'}
                    </div>
                ))}
            </nav>
            <p className="visitorCount">
                Total Visitors: {loading ? '...' : visitorCount.toLocaleString()}
            </p>
        </div>
    );
}