import React from 'react';

// Little pastel things drifting up behind the box (a nod to crypto: locks & keys).
const ICONS = {
    heart: (
        <path d="M12 21s-7-4.4-9.5-9A5 5 0 0 1 12 6.2 5 5 0 0 1 21.5 12C19 16.6 12 21 12 21z" />
    ),
    sparkle: (
        <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10z" />
    ),
    lock: (
        <>
            <path d="M8 11V8.5a4 4 0 0 1 8 0V11" fill="none" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="5" y="10.5" width="14" height="10.5" rx="3" />
            <circle cx="12" cy="15.5" r="1.6" fill="#fff" />
        </>
    ),
    key: (
        <>
            <circle cx="8" cy="12" r="4.2" fill="none" strokeWidth="2.6" />
            <path d="M12 12h9M18 12v3M21 12v2.4" fill="none" strokeWidth="2.6" strokeLinecap="round" />
        </>
    )
};

const FLOATERS = [
    { i: 'heart', x: 8, d: 0, s: 9, size: 20, c: '#ffb3c7' },
    { i: 'sparkle', x: 17, d: 2.4, s: 8, size: 16, c: '#ffe08a' },
    { i: 'lock', x: 26, d: 5, s: 10, size: 20, c: '#c9b6ff' },
    { i: 'heart', x: 34, d: 7, s: 9, size: 14, c: '#ffc9a8' },
    { i: 'key', x: 64, d: 1.2, s: 10, size: 22, c: '#ffd66b' },
    { i: 'sparkle', x: 72, d: 4.2, s: 7, size: 14, c: '#a8e6ff' },
    { i: 'heart', x: 81, d: 3, s: 9, size: 18, c: '#ffb3c7' },
    { i: 'lock', x: 90, d: 6.2, s: 11, size: 18, c: '#b6e3c9' },
    { i: 'sparkle', x: 96, d: 0.6, s: 8, size: 18, c: '#ffe08a' }
];

function CatInBox() {
    return (
        <svg className="catbox" viewBox="0 0 200 160" aria-hidden="true">
            <defs>
                <clipPath id="catbox-clip">
                    <rect x="0" y="0" width="200" height="100" />
                </clipPath>
            </defs>

            {/* "?" bubble while the cat is hiding */}
            <g className="catbox-bubble">
                <rect x="132" y="30" width="30" height="26" rx="13" />
                <path d="M140 54 l-4 8 10-6z" />
                <text x="147" y="49" textAnchor="middle">?</text>
            </g>

            <g className="catbox-box">
                {/* inside of the box */}
                <path className="box-inside" d="M40 96 L52 86 H148 L160 96 Z" />

                {/* tail peeking out the side */}
                <g className="cat-tail">
                    <path className="tail-outline" d="M152 118 C 176 116, 184 92, 172 80" />
                    <path className="tail-fill" d="M152 118 C 176 116, 184 92, 172 80" />
                </g>

                {/* the cat, clipped so it can duck inside */}
                <g clipPath="url(#catbox-clip)">
                    <g className="cat-pop">
                        <path className="cat-fur" d="M68 50 L62 20 Q63 14 69 17 L92 33 Z" />
                        <path className="cat-fur" d="M132 50 L138 20 Q137 14 131 17 L108 33 Z" />
                        <path className="cat-ear-in" d="M71 40 L67 24 L84 34 Z" />
                        <path className="cat-ear-in" d="M129 40 L133 24 L116 34 Z" />
                        <ellipse className="cat-fur" cx="100" cy="64" rx="38" ry="33" />
                        <path className="cat-patch" d="M100 31 C 92 31, 88 38, 92 44 C 96 40, 104 40, 108 44 C 112 38, 108 31, 100 31 Z" />

                        <g className="cat-eyes">
                            <g className="cat-eye">
                                <ellipse cx="85" cy="62" rx="6.5" ry="8" />
                                <circle cx="87.5" cy="58.5" r="2.6" fill="#fff" />
                                <circle cx="83" cy="65.5" r="1.2" fill="#fff" />
                            </g>
                            <g className="cat-eye">
                                <ellipse cx="115" cy="62" rx="6.5" ry="8" />
                                <circle cx="117.5" cy="58.5" r="2.6" fill="#fff" />
                                <circle cx="113" cy="65.5" r="1.2" fill="#fff" />
                            </g>
                        </g>

                        <ellipse className="cat-blush" cx="74" cy="75" rx="7" ry="4" />
                        <ellipse className="cat-blush" cx="126" cy="75" rx="7" ry="4" />
                        <path className="cat-nose" d="M96.5 71 Q100 68.5 103.5 71 Q100 75 96.5 71 Z" />
                        <path className="cat-line" d="M100 74 q -3 5 -7.5 2 M100 74 q 3 5 7.5 2" />
                        <path className="cat-line" d="M66 70 L52 67 M66 76 L53 78 M134 70 L148 67 M134 76 L147 78" />
                    </g>
                </g>

                {/* front of the box */}
                <rect className="box-front" x="40" y="96" width="120" height="62" rx="6" />
                <path className="box-flap" d="M40 96 L14 84 Q12 80 17 79 L52 86 Z" />
                <path className="box-flap" d="M160 96 L186 84 Q188 80 183 79 L148 86 Z" />

                {/* padlock sticker on the box */}
                <g className="box-sticker">
                    <path d="M94 124 v-4 a6 6 0 0 1 12 0 v4" fill="none" strokeWidth="2.6" strokeLinecap="round" />
                    <rect x="90" y="123" width="20" height="15" rx="4" />
                    <circle cx="100" cy="130" r="2" fill="#fff" />
                </g>

                {/* paws resting on the edge */}
                <g clipPath="url(#catbox-clip-paws)">
                    <g className="cat-pop">
                        <ellipse className="cat-fur" cx="80" cy="97" rx="10" ry="7" />
                        <ellipse className="cat-fur" cx="120" cy="97" rx="10" ry="7" />
                        <path className="cat-line" d="M77 95 v4 M83 95 v4 M117 95 v4 M123 95 v4" />
                    </g>
                </g>
                <defs>
                    <clipPath id="catbox-clip-paws">
                        <rect x="0" y="0" width="200" height="106" />
                    </clipPath>
                </defs>
            </g>
        </svg>
    );
}

export default function Home() {
    return (
        <div className="home-page">
            <h1>Taeyoung <br /> Kang</h1>
            <p>
                <span className="type" style={{ "--n": 82 }}>
                    Hi! I'm a Computer Science student at UW-Madison, eager to learn and hone my craft as a developer!
                </span>
            </p>

            {/* Schrödinger's cat: is it in the box or not? */}
            <div className="cute-strip" aria-hidden="true">
                {FLOATERS.map((f, n) => (
                    <svg
                        key={n}
                        className="floater"
                        viewBox="0 0 24 24"
                        style={{
                            left: `${f.x}%`,
                            width: f.size,
                            height: f.size,
                            fill: f.c,
                            stroke: f.c,
                            animationDelay: `${f.d}s`,
                            animationDuration: `${f.s}s`
                        }}
                    >
                        {ICONS[f.i]}
                    </svg>
                ))}
                <CatInBox />
            </div>
        </div>
    );
}
