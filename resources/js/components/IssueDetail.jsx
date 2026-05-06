import { useState } from 'react';

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

const inputClass = "w-full bg-[#1e2533] border border-[#2a3347] focus:border-blue-500 rounded-md text-slate-200 px-3 py-2 text-[13.5px] outline-none transition-colors";
const selectClass = "bg-[#1e2533] border border-[#2a3347] rounded-md text-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-blue-500";

export default function IssueDetail({ issue, onUpdate, onRegenerate }) {
    const [editing, setEditing] = useState(false);
    const [saving,  setSaving]  = useState(false);
    const [regen,   setRegen]   = useState(false);
    const [form,    setForm]    = useState({
        title: issue.title, description: issue.description,
        priority: issue.priority, category: issue.category, status: issue.status,
    });
    const [errors, setErrors] = useState({});

    const handleSave = async () => {
        setSaving(true); setErrors({});
        try { await onUpdate(issue.id, form); setEditing(false); }
        catch (e) { setErrors(e.errors || {}); }
        finally { setSaving(false); }
    };

    const handleRegen = async () => {
        setRegen(true);
        try { await onRegenerate(issue.id); } finally { setRegen(false); }
    };

    const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    return (
        <div className="bg-[#161b24] border border-[#2a3347] rounded-lg p-7 max-w-3xl">
            {/* Escalation banner */}
            {issue.escalated && (
                <div className="mb-5 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-300 text-[13.5px]">
                    🔴 <strong>Escalated</strong> — {issue.escalation_reason}
                </div>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
                <span className={`px-2 py-0.5 rounded font-mono text-[11.5px] font-semibold uppercase tracking-wide ${PRIORITY_BADGE[issue.priority]}`}>
                    {issue.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${STATUS_CHIP[issue.status]}`}>
                    {issue.status.replace('_', ' ')}
                </span>
                <span className="font-mono text-[12px] text-slate-500 px-2 py-0.5 bg-[#1e2533] rounded">{issue.category}</span>
                {issue.reporter_name && <span className="text-[12.5px] text-slate-400">by {issue.reporter_name}</span>}
            </div>

            {/* Title */}
            {editing
                ? <input className={`${inputClass} text-lg font-semibold mb-3.5`} value={form.title} onChange={f('title')} />
                : <h2 className="text-[22px] font-semibold leading-snug text-slate-100 mb-4">{issue.title}</h2>
            }
            {errors.title && <p className="text-[12px] text-red-400 -mt-2 mb-3">{errors.title[0]}</p>}

            {/* Edit selects */}
            {editing && (
                <div className="flex gap-3 flex-wrap mb-4">
                    {[
                        { label: 'Priority', key: 'priority', opts: ['low','medium','high','critical'] },
                        { label: 'Status',   key: 'status',   opts: ['open','in_progress','resolved','closed'] },
                        { label: 'Category', key: 'category', opts: ['bug','feature','infrastructure','security','performance','other'] },
                    ].map(({ label, key, opts }) => (
                        <label key={key} className="flex flex-col gap-1 text-[12px] text-slate-500">
                            {label}
                            <select className={selectClass} value={form[key]} onChange={f(key)}>
                                {opts.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                            </select>
                        </label>
                    ))}
                </div>
            )}

            {/* Description */}
            <div className="mb-6">
                <h3 className="text-[11.5px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Description</h3>
                {editing
                    ? <textarea className={`${inputClass} resize-y leading-relaxed`} rows={6} value={form.description} onChange={f('description')} />
                    : <p className="text-[14px] leading-relaxed text-slate-400">{issue.description}</p>
                }
                {errors.description && <p className="text-[12px] text-red-400 mt-1">{errors.description[0]}</p>}
            </div>

            {/* AI Panel */}
            <div className="bg-[#1e2533] border border-blue-900/60 rounded-lg p-5 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <div className="flex justify-between items-center mb-3 relative">
                    <span className="font-mono text-[11.5px] font-semibold uppercase tracking-widest text-blue-400">✦ AI Summary</span>
                    <button onClick={handleRegen} disabled={regen}
                        className="text-[12.5px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors disabled:opacity-50">
                        {regen ? 'Regenerating…' : '↺ Regenerate'}
                    </button>
                </div>
                <p className="text-[14px] text-slate-200 leading-relaxed mb-3 relative">{issue.ai_summary || '—'}</p>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 relative">Suggested Next Action</div>
                <p className="text-[13.5px] text-slate-400 leading-relaxed italic relative">{issue.suggested_action || '—'}</p>
            </div>

            {/* Timestamps */}
            <div className="flex gap-5 font-mono text-[11.5px] text-slate-600 mb-6 flex-wrap">
                <span>Created: {new Date(issue.created_at).toLocaleString()}</span>
                <span>Updated: {new Date(issue.updated_at).toLocaleString()}</span>
                {issue.due_at && <span>Due: {new Date(issue.due_at).toLocaleString()}</span>}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
                {editing ? (
                    <>
                        <button onClick={handleSave} disabled={saving}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-[13.5px] font-medium transition-colors">
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button onClick={() => { setEditing(false); setErrors({}); }}
                            className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-md text-[13.5px] transition-colors">
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-[#1e2533] border border-[#2a3347] hover:bg-[#242c3d] text-slate-200 rounded-md text-[13.5px] font-medium transition-colors">
                        Edit Issue
                    </button>
                )}
            </div>
        </div>
    );
}
