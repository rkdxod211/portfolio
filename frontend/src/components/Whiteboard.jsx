import React, { useEffect, useState } from 'react';

// A whiteboard whose marker doodles draw themselves, stay for a while, get
// wiped, and start over. Timings below are seconds from the start of a cycle.
const CYCLE_MS = 19000;

const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// A stroke that draws itself from start to end.
// `at`: when it starts drawing; `t`: how long the drawing takes.
// Always a <path>: Safari ignores pathLength on <line>/<circle>, which made
// those strokes show up as dots before they were drawn.
const Stroke = ({ at, t, ...props }) => (
    <path
        className="wb-draw"
        pathLength="1"
        style={{ '--d': `${at}s`, '--t': `${t}s` }}
        {...props}
    />
);

// Handwritten text, one character at a time. `parts` is a list of strings,
// or { sup: 'e' } for a superscript.
function BoardText({ x, y, size, start, step = 0.1, parts, accent = false }) {
    let i = 0;
    const spans = [];
    let lift = 0; // undo a superscript's raise on the next character
    parts.forEach((part, p) => {
        const isSup = typeof part === 'object';
        const chars = Array.from(isSup ? part.sup : part);
        chars.forEach((ch, c) => {
            const dy = isSup && c === 0 ? -size * 0.4 : (!isSup && lift ? lift : undefined);
            if (!isSup && lift) lift = 0;
            spans.push(
                <tspan
                    key={`${p}-${c}`}
                    className="wb-char"
                    dy={dy}
                    fontSize={isSup ? size * 0.6 : undefined}
                    style={{ '--d': `${start + i * step}s` }}
                >
                    {ch}
                </tspan>
            );
            i += 1;
        });
        if (isSup) lift = size * 0.4;
    });
    return <text x={x} y={y} fontSize={size} className={`wb-text${accent ? ' accent' : ''}`}>{spans}</text>;
}

function Doodles() {
    return (
        <g className="wb-ink" style={{ '--cycle': `${CYCLE_MS}ms` }}>
            {/* "Why?" with a loose circle and an arrow toward the sphere */}
            <BoardText x={42} y={98} size={72} start={0.2} step={0.22} parts={['Why?']} accent />
            <Stroke at={1.2} t={0.8}
                d="M200 62 C 196 28, 120 18, 72 30 C 26 42, 18 96, 64 112 C 110 128, 190 118, 206 82 C 212 66, 200 52, 186 46" />
            <Stroke at={2.1} t={0.6} d="M214 92 C 252 112, 292 120, 338 116" />
            <Stroke at={2.7} t={0.25} d="M322 104 L 340 116 L 322 128" />

            {/* Bloch sphere: a qubit */}
            <Stroke at={3.0} t={0.9} d="M368 130 a72 72 0 1 0 144 0 a72 72 0 1 0 -144 0" />
            <Stroke at={3.9} t={0.5} d="M368 130 C 380 152, 500 152, 512 130" />
            <path className="wb-fade wb-dashed" style={{ '--d': '4.3s' }} d="M368 130 C 380 108, 500 108, 512 130" />
            <Stroke at={4.5} t={0.35} d="M440 130 L 440 50" />
            <Stroke at={4.9} t={0.4} d="M440 130 L 486 88" />
            <path className="wb-fade wb-dot" style={{ '--d': '5.3s' }} d="M481.5 88 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0" />
            <BoardText x={448} y={46} size={26} start={5.4} step={0.08} parts={['|0⟩']} />
            <BoardText x={448} y={232} size={26} start={5.7} step={0.08} parts={['|1⟩']} />
            <BoardText x={503} y={70} size={24} start={6.0} step={0.08} parts={['ψ']} />

            {/* Qubit state */}
            <BoardText x={42} y={206} size={38} start={6.3} step={0.09} parts={['|ψ⟩ = α|0⟩ + β|1⟩']} />

            {/* RSA */}
            <BoardText x={42} y={272} size={38} start={8.0} step={0.09} parts={['c ≡ m', { sup: 'e' }, ' (mod n)']} />
            <Stroke at={9.4} t={0.6} d="M40 288 C 80 280, 120 296, 160 288 S 240 280, 290 290" />

            {/* P vs NP */}
            <BoardText x={42} y={360} size={38} start={10.1} step={0.1} parts={['P vs NP ?']} />

            {/* Padlock */}
            <Stroke at={11.2} t={0.5} d="M332 330 V 314 A 22 22 0 0 1 376 314 V 330" />
            <Stroke at={11.6} t={0.6} d="M322 330 H 386 V 382 H 322 Z" />
            <Stroke at={12.1} t={0.3} d="M348 350 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0" />
            <Stroke at={12.3} t={0.2} d="M354 356 L 354 368" />

            {/* A small graph */}
            <Stroke at={12.6} t={0.3} d="M442 312 L 506 300" />
            <Stroke at={12.8} t={0.3} d="M442 312 L 466 374" />
            <Stroke at={13.0} t={0.3} d="M506 300 L 526 362" />
            <Stroke at={13.2} t={0.3} d="M466 374 L 526 362" />
            <Stroke at={13.4} t={0.3} d="M506 300 L 466 374" />
            {[[442, 312], [506, 300], [466, 374], [526, 362]].map(([cx, cy], k) => (
                <path key={k} className="wb-fade wb-node" style={{ '--d': `${13.7 + k * 0.12}s` }} d={`M${cx - 7} ${cy} a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0`} />
            ))}
        </g>
    );
}

export default function Whiteboard() {
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (reducedMotion()) return undefined;
        const timer = setInterval(() => setCycle(c => c + 1), CYCLE_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="whiteboard" aria-hidden="true">
            <svg viewBox="0 0 560 420" className="whiteboard-svg">
                {/* Remounting restarts every animation for the next cycle */}
                <Doodles key={cycle} />
            </svg>
        </div>
    );
}
