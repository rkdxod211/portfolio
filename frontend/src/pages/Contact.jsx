import React from 'react';

export default function Contact({ database }) {
    const items = Array.isArray(database.contact) ? database.contact : [];
    const emails = items.filter(i => i.type === 'email');
    const links = items.filter(i => i.type !== 'email');

    return (
        <div>
            <h1>CONTACT</h1>
            {emails.length > 0 && (
                <>
                    <h2 className="email">EMAIL:</h2>
                    <p className="emailAddress">
                        {emails.map((item, index) => (
                            <React.Fragment key={item.id || index}>
                                <a href={`mailto:${item.value}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {item.value}
                                </a>
                                {index < emails.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                </>
            )}
            {links.map((item, index) => (
                <a
                    key={item.id || index}
                    href={/^https?:\/\//.test(item.value) ? item.value : `https://${item.value}`}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-link"
                >
                    {(item.label || item.value).toUpperCase()}
                </a>
            ))}
        </div>
    );
}
