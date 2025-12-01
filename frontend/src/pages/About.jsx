import React from 'react';

export default function About({ database }) {
    const sortedEducation = database.education 
        ? [...database.education].sort((a, b) => a.display_order - b.display_order)
        : [];
        
    return (
        <div>
            <h1>ABOUT ME</h1>
            <h2>INTRODUCTION</h2>
            <div className="experience-box">
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    {database.about.introduction}
                </p>
            </div>
            <h2>EDUCATION</h2>
            <div className="experience-box">
                {sortedEducation.map((edu) => (
                    <div key={edu.id} className="experience-item">
                        <div className="experience-title">
                            {edu.institution} ({edu.period})
                        </div>
                        <div className="experience-detail">
                            {edu.degree}
                        </div>
                    </div>
                ))}
            </div>
            <h2>INTERESTS</h2>
            <div className="experience-box" style={{ minHeight: '200px' }}>
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    {database.about.interests}
                </p>
            </div>
        </div>
    );
}
