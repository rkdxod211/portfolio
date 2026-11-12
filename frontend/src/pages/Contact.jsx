import React, { useState } from 'react';
import { Mail, Github, Linkedin, Globe, ArrowUpRight, Copy, Check, ArrowUp } from 'lucide-react';

const OWNER = 'Taeyoung Kang';

const toUrl = (value) => (/^https?:\/\//.test(value) ? value : `https://${value}`);

// "https://www.linkedin.com/in/name/" -> "linkedin.com/in/name"
const prettyUrl = (value) => value.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');

function iconFor(item) {
    if (item.type === 'email') return Mail;
    const host = prettyUrl(item.value).toLowerCase();
    if (host.startsWith('github.com')) return Github;
    if (host.startsWith('linkedin.com')) return Linkedin;
    return Globe;
}

export default function Contact({ database, onBackToTop }) {
    const items = Array.isArray(database.contact) ? database.contact : [];

    return (
        <div className="contact-page">
            <h1>CONTACT</h1>

            <div className="status-pill">
                <span className="status-dot" aria-hidden="true" />
                Open to research &amp; internship opportunities
            </div>
            <h2 className="contact-headline">Let's connect.</h2>
            <div className="contact-lede">
                Have a question, an idea, or an opportunity in mind? I'd love to hear from you.
            </div>

            <div className="contact-grid">
                {items.map((item, index) => (
                    <ContactCard key={item.id || index} item={item} />
                ))}
            </div>

            <footer className="site-footer">
                <span>© {new Date().getFullYear()} {OWNER}. All rights reserved.</span>
                {onBackToTop && (
                    <button className="back-to-top" onClick={onBackToTop}>
                        Back to top <ArrowUp size={16} />
                    </button>
                )}
            </footer>
        </div>
    );
}

function ContactCard({ item }) {
    const [copied, setCopied] = useState(false);
    const Icon = iconFor(item);
    const isEmail = item.type === 'email';
    const href = isEmail ? `mailto:${item.value}` : toUrl(item.value);
    const label = isEmail ? 'Email' : (item.label || prettyUrl(item.value).split('/')[0]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(item.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable (e.g. insecure context); the link still works
        }
    };

    return (
        <div className="contact-card">
            <a
                href={href}
                className="contact-main"
                {...(isEmail ? {} : { target: '_blank', rel: 'noreferrer' })}
            >
                <span className="contact-icon"><Icon size={24} /></span>
                <span className="contact-text">
                    <span className="contact-label">{label}</span>
                    <span className="contact-value">{isEmail ? item.value : prettyUrl(item.value)}</span>
                </span>
                {!isEmail && <span className="contact-action" aria-hidden="true"><ArrowUpRight size={20} /></span>}
            </a>
            {isEmail && (
                <button
                    className="contact-action"
                    onClick={copy}
                    title={copied ? 'Copied!' : 'Copy email address'}
                    aria-label="Copy email address"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
            )}
        </div>
    );
}
