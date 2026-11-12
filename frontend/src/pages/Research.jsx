import React from 'react';
import { MapPin, Calendar, FlaskConical, User, Award, ExternalLink } from 'lucide-react';
import { formatPeriod, splitList } from '../format';

export default function Research({ database }) {
    const items = Array.isArray(database.research) ? database.research : [];

    return (
        <div>
            <h1>RESEARCH</h1>
            {items.length === 0 ? (
                <div className="experience-box">
                    <div className="experience-detail">No research to show yet.</div>
                </div>
            ) : (
                <div className="research-list">
                    {items.map((item, index) => <ResearchCard key={item.id || index} item={item} />)}
                </div>
            )}
        </div>
    );
}

function ResearchCard({ item }) {
    const period = formatPeriod(item.start_date, item.end_date);
    const tags = splitList(item.tags);
    const link = item.link && (/^https?:\/\//.test(item.link) ? item.link : `https://${item.link}`);

    return (
        <article className="research-card">
            <div className="entry-head">
                <h3 className="research-title">{item.title}</h3>
                {period && (
                    <span className="entry-period">
                        <Calendar size={16} /> {period}
                    </span>
                )}
            </div>

            <div className="research-meta">
                {item.role && <span className="research-role">{item.role}</span>}
                {item.lab && <span><FlaskConical size={16} /> {item.lab}</span>}
                {item.location && <span><MapPin size={16} /> {item.location}</span>}
            </div>

            {tags.length > 0 && (
                <div className="tag-list">
                    {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
            )}

            {item.question && (
                <div className="research-block">
                    <div className="research-label">RESEARCH QUESTION</div>
                    <div className="research-question">{item.question}</div>
                </div>
            )}

            {item.description && (
                <div className="research-block">
                    <div className="research-label">DESCRIPTION</div>
                    <div className="research-text">{item.description}</div>
                </div>
            )}

            {(item.advisor || item.outcomes || link) && (
                <div className="research-footer">
                    {item.advisor && <span><User size={16} /> Advisor: {item.advisor}</span>}
                    {item.outcomes && <span><Award size={16} /> {item.outcomes}</span>}
                    {link && (
                        <a href={link} target="_blank" rel="noreferrer" className="research-link">
                            <ExternalLink size={16} /> Learn more
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}
