import React, { useEffect, useState } from 'react';
import Whiteboard from '../components/Whiteboard';

// Types `text`, holds, deletes it one character at a time, pauses, and repeats.
function TypeLoop({ text, typeMs = 180, deleteMs = 110, holdMs = 2600, emptyMs = 700 }) {
    const [count, setCount] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            setCount(text.length);
            return undefined;
        }
        let delay;
        if (!deleting && count === text.length) delay = holdMs;
        else if (deleting && count === 0) delay = emptyMs;
        else delay = deleting ? deleteMs : typeMs;

        const timer = setTimeout(() => {
            if (!deleting && count === text.length) setDeleting(true);
            else if (deleting && count === 0) setDeleting(false);
            else setCount(c => c + (deleting ? -1 : 1));
        }, delay);
        return () => clearTimeout(timer);
    }, [count, deleting, text, typeMs, deleteMs, holdMs, emptyMs]);

    return (
        <span className="hero-why" aria-label={text}>
            <span aria-hidden="true">{text.slice(0, count)}</span>
        </span>
    );
}

export default function Home() {
    return (
        <div className="home-page">
            <div className="hero-grid">
                <div className="hero-text">
                    <div className="hero-eyebrow">I'm Taeyoung Kang</div>
                    <h1 className="hero-title">
                        I Like to Start <br />
                        with <TypeLoop text="Why." />
                    </h1>

                    <div className="hero-tagline">
                        I want to understand not just how computers work, but <em>why</em> they
                        work — and where they break.
                    </div>

                    <div className="hero-body">
                        I'm a sophomore at the University of Wisconsin–Madison, double majoring
                        in <strong>Computer Science and Mathematics</strong>. I believe that truly
                        understanding a field means looking beyond how things work and digging into the
                        principles that make them possible. For me, mathematics provides that foundation
                        in computer science. This curiosity draws me toward the theoretical side of
                        cybersecurity — exploring the algorithms that protect information, the assumptions
                        behind secure systems, and how those systems can be broken.
                    </div>
                </div>
                <Whiteboard />
            </div>
        </div>
    );
}
