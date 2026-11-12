// "Sep 2025" + "" -> "Sep 2025 – Present"; "Jun 2025" + "Aug 2025" -> "Jun 2025 – Aug 2025".
export function formatPeriod(start, end) {
    const s = (start || '').trim();
    const e = (end || '').trim();
    if (!s) return e;
    return `${s} – ${e || 'Present'}`;
}

// "Python, Java,  React" -> ["Python", "Java", "React"]
export const splitList = (value) =>
    (value || '').split(',').map(v => v.trim()).filter(Boolean);
