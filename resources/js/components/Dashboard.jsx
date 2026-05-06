import { useStats } from '../hooks/useIssues';

const PRIORITY_COLORS = {
    critical: 'bg-red-500',
    high:     'bg-orange-500',
    medium:   'bg-yellow-500',
    low:      'bg-green-500',
};
const PRIORITY_TEXT = {
    critical: 'text-red-400',
    high:     'text-orange-400',
    medium:   'text-yellow-400',
    low:      'text-green-400',
};
const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };

function BarChart({ title, items, colorClass = 'bg-blue-500' }) {
    const max = Math.max(...items.map(i => i.count), 1);
    return (
        <div className="bg-[#161b24] border border-[#2a3347] rounded-lg p-5">
            <h3 className="text-[11.5px] font-semibold uppercase tracking-widest text-slate-500 mb-4">{title}</h3>
            <div className="flex flex-col gap-3">
                {items.map(({ label, count, barClass }) => {
                    const pct = Math.round((count / max) * 100);
                    return (
                        <div key={label} className="flex items-center gap-2.5">
                            <span className="font-mono text-[11.5px] text-slate-400 w-24 capitalize shrink-0">{label}</span>
                            <div className="flex-1 h-2 bg-[#1e2533] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${barClass || colorClass}`}
                                     style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-mono text-[12px] text-slate-500 w-6 text-right">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { stats, loading } = useStats();

    if (loading) return <div className="text-slate-500 text-center py-16">Loading dashboard…</div>;
    if (!stats)  return null;

    const priorityItems = ['critical', 'high', 'medium', 'low'].map(p => ({
        label: p, count: stats.by_priority[p] || 0, barClass: PRIORITY_COLORS[p],
    }));
    const statusItems = Object.entries(STATUS_LABELS).map(([k, label]) => ({
        label, count: stats.by_status[k] || 0,
    }));
    const categoryItems = Object.entries(stats.by_category || {})
        .sort(([,a],[,b]) => b - a)
        .map(([label, count]) => ({ label, count }));

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-[22px] font-semibold tracking-tight text-slate-100">Dashboard</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">System overview</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#161b24] border border-[#2a3347] rounded-lg p-6">
                    <div className="font-mono text-4xl font-semibold text-slate-100">{stats.total}</div>
                    <div className="text-[12.5px] font-medium uppercase tracking-widest text-slate-500 mt-1.5">Total Issues</div>
                </div>
                <div className="bg-[#161b24] border border-yellow-500/30 rounded-lg p-6">
                    <div className="font-mono text-4xl font-semibold text-yellow-400">{stats.open}</div>
                    <div className="text-[12.5px] font-medium uppercase tracking-widest text-slate-500 mt-1.5">Open</div>
                </div>
                <div className="bg-[#161b24] border border-red-500/30 rounded-lg p-6">
                    <div className="font-mono text-4xl font-semibold text-red-400">{stats.escalated}</div>
                    <div className="text-[12.5px] font-medium uppercase tracking-widest text-slate-500 mt-1.5">Escalated</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-4">
                <BarChart title="By Priority" items={priorityItems} />
                <BarChart title="By Status"   items={statusItems}   colorClass="bg-blue-500" />
                <BarChart title="By Category" items={categoryItems} colorClass="bg-violet-500" />
            </div>
        </div>
    );
}
