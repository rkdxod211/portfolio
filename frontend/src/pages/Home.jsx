import React, { useEffect, useState } from 'react';

const TWINKLES = [
    { x: 9, y: 30, d: 0, s: 10 },
    { x: 22, y: 62, d: 1.4, s: 7 },
    { x: 37, y: 22, d: 2.6, s: 8 },
    { x: 58, y: 55, d: 0.8, s: 6 },
    { x: 71, y: 18, d: 2, s: 9 },
    { x: 86, y: 48, d: 3.2, s: 7 },
    { x: 95, y: 26, d: 1, s: 6 }
];

// A little cloud buddy with an electron orbiting it (a quiet nod to quantum).
function CloudBuddy() {
    const orbit = 'M10 66 a74 20 0 1 0 148 0 a74 20 0 1 0 -148 0';
    return (
        <svg className="cloud-buddy" viewBox="0 0 168 120" aria-hidden="true">
            <path className="orbit-ring" d={orbit} />
            <g className="cloud-body">
                <path
                    className="cloud-shape"
                    d="M42 92 A22 22 0 0 1 38 48 A32 32 0 0 1 98 36 A24 24 0 0 1 132 66 A14 14 0 0 1 130 92 Z"
                />
                <g className="cloud-eyes">
                    <ellipse cx="74" cy="66" rx="3.4" ry="4.4" />
                    <ellipse cx="98" cy="66" rx="3.4" ry="4.4" />
                </g>
                <ellipse className="cloud-blush" cx="66" cy="75" rx="5.5" ry="3" />
                <ellipse className="cloud-blush" cx="106" cy="75" rx="5.5" ry="3" />
                <path className="cloud-smile" d="M81 74 q5 5 10 0" />
            </g>
            <circle className="electron" r="3.6">
                <animateMotion dur="4s" repeatCount="indefinite" path={orbit} />
            </circle>
        </svg>
    );
}

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
                <div>
                    I'm a sophomore at the University of Wisconsin–Madison, double majoring
                    in <strong>Computer Science and Mathematics</strong>. I'm particularly interested
                    in <strong>cryptography</strong>, <strong>quantum computing</strong>, and
                    the <strong>mathematical foundations of computation</strong>.
                </div>
                <div>
                    I believe that truly understanding a field means looking beyond how things work
                    and digging into the principles that make them possible. For me, mathematics
                    provides that foundation in computer science. This curiosity draws me toward the
                    theoretical side of cybersecurity — exploring the algorithms that protect
                    information, the assumptions behind secure systems, and how those systems can
                    be broken.
                </div>
            </div>

            <div className="sky-strip" aria-hidden="true">
                {TWINKLES.map((t, i) => (
                    <svg
                        key={i}
                        className="twinkle"
                        viewBox="0 0 24 24"
                        style={{
                            left: `${t.x}%`,
                            top: `${t.y}%`,
                            width: t.s * 2,
                            height: t.s * 2,
                            animationDelay: `${t.d}s`
                        }}
                    >
                        <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10z" />
                    </svg>
                ))}
                <div className="cloud-drift">
                    <CloudBuddy />
                </div>
            </div>
        </div>
    );
}
