// resources/js/lib/api.js
import { getToken } from './auth';

const AUTH_BASE = '/api';
const ISSUE_BASE = '/api/issues';

async function request(base, path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${base}${path}`, {
        headers,
        ...options,
    });

    const json = await res.json();
    if (!res.ok) {
        const err = new Error(json.message || 'Request failed');
        err.errors = json.errors || {};
        err.status = res.status;
        throw err;
    }
    return json;
}

export const api = {
    // Auth
    login: (body) => request(AUTH_BASE, '/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request(AUTH_BASE, '/logout', { method: 'POST' }),
    me: () => request(AUTH_BASE, '/user'),

    // Stats for dashboard
    stats: () => request(ISSUE_BASE, '/stats'),

    // List issues — accepts filter params object
    list: (params = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
        ).toString();
        return request(ISSUE_BASE, qs ? `/?${qs}` : '/');
    },

    // Single issue
    get: (id) => request(ISSUE_BASE, `/${id}`),

    // Create
    create: (body) => request(ISSUE_BASE, '/', { method: 'POST', body: JSON.stringify(body) }),

    // Update (partial)
    update: (id, body) => request(ISSUE_BASE, `/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

    // Delete
    delete: (id) => request(ISSUE_BASE, `/${id}`, { method: 'DELETE' }),

    // Re-generate AI summary
    regenerate: (id) => request(ISSUE_BASE, `/${id}/regenerate-summary`, { method: 'POST' }),
};
