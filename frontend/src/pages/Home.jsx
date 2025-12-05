import React, { useState, useEffect } from 'react';

export default function Home() {
    const [guestbookMessages, setGuestbookMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuestbook = async () => {
            try {
                const response = await fetch('/api/guestbook');
                const data = await response.json();
                                
                if (data.length === 0) {
                    setGuestbookMessages([
                        { nickname: 'Guest', message: 'Be the first to leave a message!' }
                    ]);
                } else {
                    setGuestbookMessages(data);
                }
                
                setLoading(false);
            } catch (error) {
                setGuestbookMessages([
                    { nickname: 'Guest', message: 'Welcome to my portfolio!' }
                ]);
                setLoading(false);
            }
        };

        fetchGuestbook();
    }, []);

    const duplicatedMessages = [...guestbookMessages, ...guestbookMessages];

    return (
        <div className="home-page">
            <h1>Taeyoung <br /> Kang</h1>
            <p>
                <span className="type" style={{ "--n": 82 }}>
                    Hi! I'm a Computer Science student at UW-Madison, eager to learn and hone my craft as a developer!
                </span>
            </p>

            {/* Guestbook Animation */}
            <div className="guestbook-container">
                <div className="guestbook-scroll">
                    {loading ? (
                        <div className="guestbook-item">
                            <div className="guestbook-message">Loading messages...</div>
                        </div>
                    ) : (
                        duplicatedMessages.map((msg, index) => (
                            <div key={index} className="guestbook-item">
                                <div className="guestbook-author">{msg.nickname}</div>
                                <div className="guestbook-message">{msg.message}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
