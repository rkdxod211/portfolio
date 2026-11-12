import React from 'react';
import { Lock } from 'lucide-react';

const LABELS = {
    home: 'HOME',
    about: 'ABOUT ME',
    projects: 'PROJECTS',
    research: 'RESEARCH',
    experience: 'EXPERIENCE',
    contact: 'CONTACT'
};

// Fixed bar across the top: photo + name on the left, sections, Admin on the right.
export default function TopNav({ currentPage, scrollToPage, pages, onAdminClick, profileSrc }) {
    return (
        <header className="topnav">
            <button className="topnav-brand" onClick={() => scrollToPage(0)}>
                {profileSrc
                    ? <img src={profileSrc} alt="" className="topnav-photo" />
                    : <span className="topnav-photo profile-placeholder" aria-hidden="true" />}
                <span className="topnav-name">TAEYOUNG KANG</span>
            </button>

            <nav className="topnav-links">
                {pages.map((page, index) => (
                    <button
                        key={page}
                        className={`topnav-link ${currentPage === index ? 'active' : ''}`}
                        onClick={() => scrollToPage(index)}
                    >
                        {LABELS[page] || page.toUpperCase()}
                    </button>
                ))}
            </nav>

            <button onClick={onAdminClick} className="topnav-admin">
                <Lock size={16} />
                Admin
            </button>
        </header>
    );
}
