// import React from 'react';
// import { Lock } from 'lucide-react';
// import "../style.css";

// export default function Sidebar({ currentPage, scrollToPage, pages, onAdminClick }) {
//     return (
//         <div className="sidebar">
//             <button onClick={onAdminClick} className="admin-button">
//                 <Lock size={16} />
//                 Admin
//             </button>

//             <img src="/images/pp.jpg" alt="Profile" className="profile-img" />

//             <nav>
//                 {pages.map((page, index) => (
//                     <div
//                         key={page}
//                         className={`nav-link ${currentPage === index ? 'active' : ''}`}
//                         onClick={() => scrollToPage(index)}
//                     >
//                         {page === 'home' ? 'HOME' :
//                         page === 'about' ? 'ABOUT ME' :
//                         page === 'projects' ? 'PROJECTS' :
//                         page === 'experience' ? 'EXPERIENCE' :
//                         'CONTACT'}
//                     </div>
//                 ))}
//             </nav>
//             <p className="visitorCount">
//                 Total Visitors: 
//             </p>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import "../style.css";

export default function Sidebar({ currentPage, scrollToPage, pages, onAdminClick }) {
    const [visitorCount, setVisitorCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // CounterAPI V1 사용 (API 키 필요 없음!)
        // 스크린샷의 API Slug 사용
        const apiSlug = 'portfolio_visitors'; // 실제 API Slug로 변경하세요
        
        fetch(`https://api.counterapi.dev/v1/${apiSlug}/up`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Visitor count:', data.count);
                setVisitorCount(data.count);
                setLoading(false);
            })
            .catch(error => {
                console.error('❌ CounterAPI Error:', error);
                
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
                console.log('Using fallback counter:', count);
            });
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