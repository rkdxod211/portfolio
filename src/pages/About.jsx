import React from 'react';

export default function About() {
    return (
        <div>
        <h1>ABOUT ME</h1>

        <h2>INTRODUCTION</h2>
        <div className="experience-box">
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            add later
            </p>
        </div>
        
        <h2>EDUCATION</h2>
        <div className="experience-box">
            <div className="experience-item">
            <div className="experience-title">
                University of Wisconsin-Madison (2025 - present)
            </div>
            <div className="experience-detail">
                B.S. in Computer Science
            </div>
            </div>
            <div className="experience-item">
            <div className="experience-title">
                North London Collegiate School Jeju (2019-2025)
            </div>
            <div className="experience-detail">
                International Baccalaureate Diploma
            </div>
            </div>
        </div>
        
        <h2>INTERESTS</h2>
        <div className="experience-box" style={{ minHeight: '200px' }}>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            add later
            </p>
        </div>
        </div>
    );
}