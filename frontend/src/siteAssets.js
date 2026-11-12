// Replaceable site files. The admin can upload new ones (stored in Supabase);
// until then these bundled files in /public are used.
export const DEFAULT_ASSETS = {
    profile: '/images/pp.jpg',
    background: '/images/bg.png',
    resume: '/files/Taeyoung_Kang_Resume.pdf'
};

export const RESUME_FILENAME = 'Taeyoung_Kang_Resume.pdf';

// Merge the server's { key: url | null } over the defaults.
export const resolveAssets = (fromServer = {}) =>
    Object.fromEntries(Object.entries(DEFAULT_ASSETS).map(([k, def]) => [k, fromServer[k] || def]));

export async function fetchAssets() {
    try {
        const res = await fetch('/api/assets');
        return res.ok ? await res.json() : {};
    } catch {
        return {};
    }
}
