import React from 'react';
import { Download } from 'lucide-react';

export default function Experience() {
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
            Python • Java • HTML/CSS • Javascript
            </p>
        </div>

        <h2>CLUBS / ACTIVITIES</h2>
        <div className="experience-box">
            <div className="experience-item">
            <div className="experience-title">Club 1</div>
            <div className="experience-detail">Member</div>
            </div>
            <div className="experience-item">
            <div className="experience-title">Activity 1</div>
            <div className="experience-detail">Participant</div>
            </div>
        </div>

        <h2>WORK / INTERNSHIP</h2>
        <div className="experience-box">
            <div className="experience-item">
            <div className="experience-title">Work 1</div>
            <div className="experience-detail">Company Name (when)</div>
            </div>
            <div className="experience-item">
            <div className="experience-title">Intership 1</div>
            <div className="experience-detail">Company Name  (when)</div>
            </div>
        </div>

        {/* Resume Download Button */}
        <button className="resume-download" onClick={handleResumeDownload}>
            <Download size={24} />
            Download Full Resume
        </button>
        </div>
    );
}
