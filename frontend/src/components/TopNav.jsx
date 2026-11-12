import React, { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

const LABELS = {
    home: 'HOME',
    about: 'ABOUT ME',
    projects: 'PROJECTS',
    research: 'RESEARCH',
    experience: 'EXPERIENCE',
    contact: 'CONTACT'
};

// Fixed bar across the top. The photo opens a small menu (Admin); the name
// jumps straight back to the first page.
export default function TopNav({ currentPage, scrollToPage, onHome, pages, onAdminClick, profileSrc }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close the menu on an outside click or Escape.
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onPointer = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    return (
        <header className="topnav">
            <div className="topnav-brand">
                <div className="topnav-menu-wrap" ref={menuRef}>
                    <button
                        className="topnav-photo-btn"
                        onClick={() => setMenuOpen(open => !open)}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label="Open menu"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {profileSrc
                            ? <img src={profileSrc} alt="" className="topnav-photo" draggable={false} />
                            : <span className="topnav-photo profile-placeholder" />}
                    </button>
                    {menuOpen && (
                        <div className="topnav-menu" role="menu">
                            <button
                                role="menuitem"
                                className="topnav-menu-item"
                                onClick={() => { setMenuOpen(false); onAdminClick(); }}
                            >
                                <Lock size={16} /> Admin
                            </button>
                        </div>
                    )}
                </div>
                <button className="topnav-name" onClick={onHome}>TAEYOUNG KANG</button>
            </div>

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
        </header>
    );
}
