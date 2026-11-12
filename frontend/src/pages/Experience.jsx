import React from 'react';
import { Download } from 'lucide-react';
import { RESUME_FILENAME } from '../siteAssets';
import { formatPeriod } from '../format';

export default function Experience({ database, resumeUrl }) {
    const handleResumeDownload = () => {
        // `download` is ignored for cross-origin links, so ask Supabase Storage
        // to send it as an attachment with the right name instead.
        const link = document.createElement('a');
        link.href = `${resumeUrl}?download=${encodeURIComponent(RESUME_FILENAME)}`;
        link.download = RESUME_FILENAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h1>EXPERIENCE</h1>
            <h2>CLUBS / ACTIVITIES</h2>
            <div className="experience-box">
                {database.experience.clubs.map((club, index) => (
                    <ExperienceItem key={club.id || index} entry={club} />
                ))}
            </div>
            <h2>WORK / INTERNSHIP</h2>
            <div className="experience-box">
                {database.experience.work.map((work, index) => (
                    <ExperienceItem key={work.id || index} entry={work} />
                ))}
            </div>
            {resumeUrl && (
                <button className="resume-download" onClick={handleResumeDownload}>
                    <Download size={24} />
                    Download Full Resume
                </button>
            )}
        </div>
    );
}

function ExperienceItem({ entry }) {
    const period = formatPeriod(entry.start_date, entry.end_date);
    return (
        <div className="experience-item">
            <div className="entry-head">
                <div className="experience-title">{entry.title}</div>
                {period && <span className="entry-period">{period}</span>}
            </div>
            <div className="experience-detail">{entry.detail}</div>
        </div>
    );
}
