import { useState } from 'react';

const selectClass = "bg-[#1e2533] border border-[#2a3347] rounded-md text-slate-300 px-3 py-1.5 text-[13px] outline-none focus:border-blue-500 cursor-pointer";

export default function FilterBar({ filters, onChange }) {
    const [search, setSearch] = useState(filters.search || '');

    const set = (key, val) => onChange(f => ({ ...f, [key]: val, page: 1 }));

    const handleSearch = (e) => { e.preventDefault(); set('search', search); };

    const clearAll = () => {
        setSearch('');
        onChange({ status: '', priority: '', category: '', search: '', page: 1 });
    };

    const hasFilters = filters.status || filters.priority || filters.category || filters.search;

    return (
        <div className="flex items-center gap-2.5 flex-wrap mb-4 px-4 py-3 bg-[#161b24] border border-[#2a3347] rounded-lg">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    className="bg-[#1e2533] border border-[#2a3347] rounded-md text-slate-300 px-3 py-1.5 text-[13px] outline-none focus:border-blue-500 w-48 placeholder:text-slate-600"
                    placeholder="Search issues…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit"
                    className="px-3 py-1.5 bg-[#1e2533] border border-[#2a3347] rounded-md text-[12.5px] text-slate-300 hover:bg-[#242c3d] transition-colors">
                    Search
                </button>
            </form>

            <select className={selectClass} value={filters.status} onChange={e => set('status', e.target.value)}>
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
            </select>

            <select className={selectClass} value={filters.priority} onChange={e => set('priority', e.target.value)}>
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>

            <select className={selectClass} value={filters.category} onChange={e => set('category', e.target.value)}>
                <option value="">All Categories</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
            </select>

            {hasFilters && (
                <button onClick={clearAll}
                    className="px-3 py-1.5 text-[12.5px] text-slate-400 hover:text-slate-200 transition-colors">
                    ✕ Clear
                </button>
            )}
        </div>
    );
}
