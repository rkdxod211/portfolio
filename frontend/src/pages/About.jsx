import React from 'react';
import { splitList } from '../format';

export const TOOL_CATEGORIES = [
    { key: 'languages', label: 'Languages' },
    { key: 'frameworks', label: 'Frameworks & Libraries' },
    { key: 'databases', label: 'Databases & Cloud' },
    { key: 'devtools', label: 'Developer Tools' }
];

export default function About({ database }) {
    const sortedEducation = database.education 
        ? [...database.education].sort((a, b) => a.display_order - b.display_order)
        : [];
    const tools = database.about.tools || {};

    return (
        <div>
            <h1>ABOUT ME</h1>
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
            <div className="experience-box">
                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    {database.about.interests}
                </p>
            </div>
            <h2>TOOLS</h2>
            <div className="experience-box">
                {TOOL_CATEGORIES.map(({ key, label }) => {
                    const items = splitList(tools[key]);
                    if (items.length === 0) return null;
                    return (
                        <div key={key} className="tool-row">
                            <div className="tool-category">{label}</div>
                            <div className="tag-list">
                                {items.map(item => <span key={item} className="tag">{item}</span>)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
