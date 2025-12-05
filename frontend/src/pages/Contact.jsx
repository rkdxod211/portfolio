import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact({ database }) {
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (nickname.length < 2 || nickname.length > 20) {
            alert('닉네임은 2-20자여야 합니다');
            return;
        }
        
        if (message.length > 500) {
            alert('메시지는 500자 이하여야 합니다');
            return;
        }
        
        try {
            setSubmitting(true);
            
            const response = await fetch('/api/guestbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nickname, message })
            });

            if (response.ok) {
                alert('Thank you for your message!');
                setNickname('');
                setMessage('');
            } else {
                const error = await response.json();
                alert(error.error || '작성에 실패했습니다');
            }
        } catch (error) {
            alert('작성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

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

            {/* Guestbook Section */}
            <div className="guestbook-form-section">
                <h2>LEAVE A MESSAGE!</h2>
                <form onSubmit={handleSubmit} className="guestbook-form">
                    <div className="guestbook-form-group">
                        <label className="guestbook-label">Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="guestbook-input"
                            placeholder="Enter your nickname"
                            required
                            maxLength={30}
                        />
                    </div>
                    <div className="guestbook-form-group">
                        <label className="guestbook-label">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="guestbook-textarea"
                            placeholder="Leave a message..."
                            required
                            maxLength={200}
                            rows={4}
                        />
                    </div>
                    <button type="submit" className="guestbook-submit">
                        <Send size={20} />
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}