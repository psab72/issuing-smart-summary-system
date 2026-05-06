// resources/js/lib/api.js
// All API calls go through this thin client so the base URL is one place.

const BASE = '/api/issues';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
    // Stats for dashboard
    stats: () => request('/stats'),

    // List issues — accepts filter params object
    list: (params = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
        ).toString();
        return request(qs ? `/?${qs}` : '/');
    },

    // Single issue
    get: (id) => request(`/${id}`),

    // Create
    create: (body) => request('/', { method: 'POST', body: JSON.stringify(body) }),

    // Update (partial)
    update: (id, body) => request(`/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

    // Delete
    delete: (id) => request(`/${id}`, { method: 'DELETE' }),

    // Re-generate AI summary
    regenerate: (id) => request(`/${id}/regenerate-summary`, { method: 'POST' }),
};
