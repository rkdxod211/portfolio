import React, { useEffect, useState } from 'react';

// A whiteboard whose marker doodles draw themselves, stay for a while, get
// wiped, and start over. Each doodle nods to an interest: curiosity ("Why?"),
// quantum computing, cryptography, math, and theory of computation.
// Timings are seconds from the start of a cycle.
const CYCLE_MS = 19000;

const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Every shape is a <path> so `pathLength` (used by the draw-on effect) works in
// all browsers; Safari ignores it on <line>/<circle>, which leaves stray dots.
const circle = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
const star = (x, y, s) =>
    `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;

// A stroke that draws itself. `at`: start time; `t`: how long it takes.
const Stroke = ({ at, t, className = '', ...props }) => (
    <path
        className={`wb-draw ${className}`}
        pathLength="1"
        style={{ '--d': `${at}s`, '--t': `${t}s` }}
        {...props}
    />
);

// Handwritten text, one character at a time. `parts`: strings, or { sup: '...' }.
function BoardText({ x, y, size, start, step = 0.1, parts, tone = '' }) {
    let i = 0;
    let lift = 0; // undo a superscript's raise on the next character
    const spans = [];
    parts.forEach((part, p) => {
        const isSup = typeof part === 'object';
        Array.from(isSup ? part.sup : part).forEach((ch, c) => {
            let dy;
            if (isSup && c === 0) dy = -size * 0.4;
            else if (!isSup && lift) { dy = lift; lift = 0; }
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
    return <text x={x} y={y} fontSize={size} className={`wb-text ${tone}`}>{spans}</text>;
}

function Doodles() {
    return (
        <g className="wb-ink" style={{ '--cycle': `${CYCLE_MS}ms` }}>
            {/* Curiosity: "Why?" circled, and a little lightbulb */}
            <BoardText x={44} y={98} size={70} start={0.2} step={0.22} parts={['Why?']} tone="accent" />
            <Stroke at={1.2} t={0.8}
                d="M196 60 C 192 28, 118 18, 72 30 C 28 42, 20 96, 64 110 C 110 124, 186 116, 202 82 C 208 66, 198 52, 184 46" />
            <Stroke at={2.1} t={0.5} d="M226 84 C 210 72, 210 44, 234 42 C 258 44, 258 72, 242 84 Z" />
            <Stroke at={2.6} t={0.15} d="M228 92 H 240" />
            <Stroke at={2.75} t={0.15} d="M230 99 H 238" />
            <Stroke at={2.9} t={0.12} d="M234 32 V 22" />
            <Stroke at={3.0} t={0.12} d="M256 42 L 263 35" />
            <Stroke at={3.1} t={0.12} d="M212 42 L 205 35" />

            {/* Quantum: a qubit, 0 and 1 at once */}
            <Stroke at={3.4} t={0.8} d={circle(452, 112, 62)} />
            <Stroke at={4.2} t={0.4} d="M390 112 C 402 132, 502 132, 514 112" />
            <path className="wb-fade wb-dashed" style={{ '--d': '4.6s' }} d="M390 112 C 402 92, 502 92, 514 112" />
            <Stroke at={4.7} t={0.3} d="M452 112 V 50" />
            <Stroke at={5.0} t={0.3} d="M452 112 L 490 78" />
            <path className="wb-fade wb-dot" style={{ '--d': '5.3s' }} d={circle(490, 78, 4.5)} />
            <BoardText x={404} y={214} size={26} start={5.4} step={0.06} parts={['0 & 1 at once']} tone="muted" />

            {/* Cryptography: hello -> lock -> scrambled */}
            <BoardText x={44} y={250} size={36} start={6.4} step={0.08} parts={['hello']} />
            <Stroke at={6.9} t={0.25} d="M122 240 H 152 M 144 233 L 152 240 L 144 247" />
            <Stroke at={7.2} t={0.3} d="M168 228 V 220 A 11 11 0 0 1 190 220 V 228" />
            <Stroke at={7.5} t={0.4} d="M162 228 H 196 V 254 H 162 Z" />
            <path className="wb-fade wb-dot" style={{ '--d': '7.9s' }} d={circle(179, 239, 3)} />
            <Stroke at={8.0} t={0.25} d="M206 240 H 236 M 228 233 L 236 240 L 228 247" />
            <BoardText x={246} y={250} size={36} start={8.3} step={0.1} parts={['x7#q']} />

            {/* Math: Euler's identity with a highlighter swipe */}
            <Stroke at={9.0} t={0.5} className="wb-highlight" d="M40 331 C 90 327, 160 333, 222 329" />
            <BoardText x={46} y={344} size={38} start={9.4} step={0.09} parts={['e', { sup: 'iπ' }, ' + 1 = 0']} />

            {/* Theory of computation: a tiny machine that goes from "?" to "!" */}
            <Stroke at={10.8} t={0.25} d="M318 352 H 346 M 338 345 L 346 352 L 338 359" />
            <Stroke at={11.0} t={0.45} d={circle(370, 352, 24)} />
            <Stroke at={11.5} t={0.35} d="M396 352 H 444 M 436 345 L 444 352 L 436 359" />
            <Stroke at={11.9} t={0.45} d={circle(470, 352, 24)} />
            <Stroke at={12.0} t={0.45} d={circle(470, 352, 18)} />
            <BoardText x={362} y={362} size={30} start={12.5} parts={['?']} />
            <BoardText x={465} y={362} size={30} start={12.7} parts={['!']} tone="accent" />

            {/* Sparkles */}
            <Stroke at={13.0} t={0.3} d={star(530, 40, 9)} />
            <Stroke at={13.25} t={0.3} d={star(300, 300, 7)} />
            <Stroke at={13.5} t={0.3} d={star(330, 60, 6)} />
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
