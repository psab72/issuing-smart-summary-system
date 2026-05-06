const PRIORITY_BADGE = {
    critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
    high:     'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    medium:   'bg-yellow-500/12 text-yellow-400 border border-yellow-500/30',
    low:      'bg-green-500/12 text-green-400 border border-green-500/30',
};
const STATUS_CHIP = {
    open:        'bg-blue-500/12 text-blue-400',
    in_progress: 'bg-violet-500/12 text-violet-400',
    resolved:    'bg-green-500/12 text-green-400',
    closed:      'bg-[#1e2533] text-slate-500',
};

function relativeTime(iso) {
    const diff  = Date.now() - new Date(iso);
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days > 0)  return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
}

export default function IssueList({ issues, loading, onSelect }) {
    const colClass = "grid grid-cols-[1fr_110px_90px_110px_70px] items-center gap-3";

    if (loading) return (
        <div className="flex flex-col gap-0">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[#161b24] border border-[#2a3347] border-b-0 last:border-b animate-pulse first:rounded-t-lg last:rounded-b-lg" />
            ))}
        </div>
    );

    if (!issues.length) return (
        <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🎉</div>
            <p>No issues found. Adjust your filters or submit a new one.</p>
        </div>
    );

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className={`${colClass} px-4 py-2 text-[11.5px] font-semibold uppercase tracking-widest text-slate-500 bg-[#161b24] border border-[#2a3347] border-b-0 rounded-t-lg`}>
                <span>Title</span>
                <span>Category</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Age</span>
            </div>
            {issues.map((issue, idx) => (
                <button
                    key={issue.id}
                    onClick={() => onSelect(issue)}
                    className={`${colClass} px-4 py-3.5 border border-[#2a3347] border-b-0 bg-[#161b24] hover:bg-[#242c3d] transition-colors text-left w-full
                        ${idx === issues.length - 1 ? 'border-b rounded-b-lg' : ''}`}
                >
                    <span className="flex flex-col gap-0.5 min-w-0">
                        <span className="flex items-center gap-1.5">
                            {issue.escalated && <span className="text-[10px]" title="Escalated">🔴</span>}
                            <span className="font-medium text-[13.5px] text-slate-200 truncate">{issue.title}</span>
                        </span>
                        {issue.ai_summary && (
                            <span className="text-[12px] text-slate-500 truncate">{issue.ai_summary}</span>
                        )}
                    </span>
                    <span className="font-mono text-[12px] text-slate-400">{issue.category}</span>
                    <span className={`inline-block px-2 py-0.5 rounded font-mono text-[11.5px] font-semibold uppercase tracking-wide ${PRIORITY_BADGE[issue.priority]}`}>
                        {issue.priority}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-medium ${STATUS_CHIP[issue.status]}`}>
                        {issue.status.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-[12px] text-slate-500">{relativeTime(issue.created_at)}</span>
                </button>
            ))}
        </div>
    );
}
