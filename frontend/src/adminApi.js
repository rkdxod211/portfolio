// Admin token from /api/auth/login, kept for this browser tab only.
const KEY = 'adminToken';

export const getToken = () => {
    try { return sessionStorage.getItem(KEY); } catch { return null; }
};

export const setToken = (token) => {
    try {
        if (token) sessionStorage.setItem(KEY, token);
        else sessionStorage.removeItem(KEY);
    } catch { /* storage unavailable */ }
};

// fetch() that sends the admin token. On 401 the session has expired.
export async function adminFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${getToken() || ''}` }
    });
    if (res.status === 401) {
        alert('Admin session expired. Please log in again.');
    }
    return res;
}
