import React from 'react';
import { Download } from 'lucide-react';

export default function Experience({ database }) {
    const handleResumeDownload = () => {
        const resumePath = './files/Taeyoung_Kang_Resume.pdf';
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Taeyoung_Kang_Resume.pdf';
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
