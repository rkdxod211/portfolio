import React from 'react';
import { Download } from 'lucide-react';
import { RESUME_FILENAME } from '../siteAssets';

export default function Experience({ database, resumeUrl }) {
    const handleResumeDownload = () => {
        // `download` is ignored for cross-origin links, so ask Supabase Storage
        // to send it as an attachment with the right name instead.
        const isRemote = /^https?:\/\//.test(resumeUrl);
        const link = document.createElement('a');
        link.href = isRemote ? `${resumeUrl}?download=${encodeURIComponent(RESUME_FILENAME)}` : resumeUrl;
        link.download = RESUME_FILENAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>EXPERIENCE</h1>
            <h2>LANGUAGES</h2>
            <div className="experience-box">
                <p style={{ fontSize: '20px', color: 'white', margin: 0 }}>
                    {database.experience.languages}
                </p>
            </div>
            <h2>CLUBS / ACTIVITIES</h2>
            <div className="experience-box">
                {database.experience.clubs.map((club, index) => (
                    <div key={index} className="experience-item">
                        <div className="experience-title">{club.title}</div>
                        <div className="experience-detail">{club.detail}</div>
                    </div>
                ))}
            </div>
            <h2>WORK / INTERNSHIP</h2>
            <div className="experience-box">
                {database.experience.work.map((work, index) => (
                    <div key={index} className="experience-item">
                        <div className="experience-title">{work.title}</div>
                        <div className="experience-detail">{work.detail}</div>
                    </div>
                ))}
            </div>
            <button className="resume-download" onClick={handleResumeDownload}>
                <Download size={24} />
                Download Full Resume
            </button>
        </div>
    );
}