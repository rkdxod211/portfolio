// Admin-replaceable site files (profile photo, resume), stored in Supabase.
// With nothing uploaded, the profile shows a plain grey circle and there is no resume.

export const RESUME_FILENAME = 'Taeyoung_Kang_Resume.pdf';

// { profile: url | null, resume: url | null }
export async function fetchAssets() {
    try {
        const res = await fetch('/api/assets');
        return res.ok ? await res.json() : {};
    } catch {
        return {};
    }
}
