import React from 'react';

export default function Contact() {
    return (
        <div>
        <h1>CONTACT</h1>
        
        <h2 className="email">EMAIL:</h2>
        <p className="emailAddress">
            tkang55@wisc.edu <br />
            taeyoung070211@gmail.com
        </p>
        
        <a
            href="https://github.com/rkdxod211"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
        >
            GITHUB
        </a>
        
        <a
            href="https://www.linkedin.com/in/taeyoung-kang/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
        >
            LINKEDIN
        </a>
        </div>
    );
}