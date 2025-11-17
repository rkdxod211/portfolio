import React from 'react';

export default function Home() {
    const guestbookMessages = [
        { author: "A", message: "aaaaaaaa" },
        { author: "B", message: "bbbbbbbbb" },
        { author: "C", message: "ccccccccc" },
        { author: "D", message: "dddddddddd" },
        { author: "E", message: "eeeeeeeeee" },
        { author: "F", message: "fffffffff" },
        { author: "G", message: "gggggggg" }
    ];

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
            {duplicatedMessages.map((msg, index) => (
                <div key={index} className="guestbook-item">
                <div className="guestbook-author">{msg.author}</div>
                <div className="guestbook-message">{msg.message}</div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}
