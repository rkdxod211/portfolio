import React from 'react';

export default function Contact({ database }) {
    return (
        <div>
            <h1>CONTACT</h1>
            <h2 className="email">EMAIL:</h2>
            <p className="emailAddress">
                {database.contact.emails.map((email, index) => (
                    <React.Fragment key={index}>
                        {email}
                        {index < database.contact.emails.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
            <a
                href={database.contact.github}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
            >
                GITHUB
            </a>
            <a
                href={database.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
            >
                LINKEDIN
            </a>
        </div>
    );
}