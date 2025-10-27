import React from 'react';
import "../style.css";

export default function Sidebar({ currentPage, scrollToPage, pages }) {
    return (
        <div className="sidebar">
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
        </div>
    );
}