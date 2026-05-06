// resources/js/hooks/useIssues.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export function useIssues(filters) {
    const [issues, setIssues] = useState([]);
    const [meta, setMeta]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.list(filters);
            setIssues(data.data);
            setMeta(data.meta);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => { load(); }, [load]);

    return { issues, meta, loading, error, reload: load };
}

export function useStats() {
    const [stats, setStats]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.stats()
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
}
