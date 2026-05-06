import { useState, useCallback } from 'react';
import IssueList   from './components/IssueList';
import IssueForm   from './components/IssueForm';
import IssueDetail from './components/IssueDetail';
import Dashboard   from './components/Dashboard';
import FilterBar   from './components/FilterBar';
import { useIssues } from './hooks/useIssues';
import { api } from './lib/api';

export default function App() {
    const [view, setView]         = useState('list');
    const [selected, setSelected] = useState(null);
    const [filters, setFilters]   = useState({ status: '', priority: '', category: '', search: '' });
    const [toast, setToast]       = useState(null);

    const { issues, meta, loading, error, reload } = useIssues(filters);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleCreate = async (data) => {
        try {
            await api.create(data);
            showToast('Issue created successfully.');
            setView('list');
            reload();
        } catch (e) { throw e; }
    };

    const handleUpdate = async (id, data) => {
        try {
            const updated = await api.update(id, data);
            setSelected(updated.data);
            showToast('Issue updated.');
            reload();
        } catch (e) { throw e; }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this issue? This cannot be undone.')) return;
        await api.delete(id);
        setView('list');
        setSelected(null);
        reload();
        showToast('Issue deleted.', 'info');
    };

    const handleRegenerate = async (id) => {
        const updated = await api.regenerate(id);
        setSelected(updated.data);
        showToast('Summary regenerated.');
        reload();
    };

    const openDetail = (issue) => { setSelected(issue); setView('detail'); };

    const toastColors = {
        success: 'bg-green-900 border border-green-500 text-green-300',
        info:    'bg-blue-900 border border-blue-500 text-blue-300',
        error:   'bg-red-900 border border-red-500 text-red-300',
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <nav className="w-52 flex-shrink-0 bg-[#161b24] border-r border-[#2a3347] flex flex-col">
                <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#2a3347]">
                    <span className="text-xl">⚡</span>
                    <span className="font-mono font-semibold text-[15px] tracking-wide text-slate-100">IssueOps</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 flex-1">
                    {[
                        { id: 'dashboard', icon: '▦', label: 'Dashboard' },
                        { id: 'list',      icon: '☰', label: 'Issues' },
                        { id: 'new',       icon: '+', label: 'New Issue' },
                    ].map(({ id, icon, label }) => (
                        <button
                            key={id}
                            onClick={() => { setView(id); if (id !== 'detail') setSelected(null); }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium text-left transition-colors
                                ${(view === id || (id === 'list' && view === 'detail'))
                                    ? 'bg-blue-900/40 text-blue-400'
                                    : 'text-slate-400 hover:bg-[#242c3d] hover:text-slate-200'}`}
                        >
                            <span className="opacity-70">{icon}</span> {label}
                        </button>
                    ))}
                </div>
                <div className="px-4 py-4 border-t border-[#2a3347]">
                    <span className="font-mono text-[11px] text-slate-600 tracking-widest">✦ AI-powered</span>
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 overflow-y-auto p-7 relative">
                {/* Toast */}
                {toast && (
                    <div className={`fixed top-5 right-6 z-50 px-4 py-2.5 rounded-md text-[13.5px] font-medium animate-fade-in ${toastColors[toast.type]}`}>
                        {toast.msg}
                    </div>
                )}

                {view === 'dashboard' && <Dashboard />}

                {view === 'list' && (
                    <>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-[22px] font-semibold tracking-tight text-slate-100">Issues</h1>
                                {meta && <p className="text-[13px] text-slate-500 mt-0.5">{meta.total} total</p>}
                            </div>
                            <button onClick={() => setView('new')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[13.5px] font-medium transition-colors">
                                + New Issue
                            </button>
                        </div>
                        <FilterBar filters={filters} onChange={setFilters} />
                        {error && <div className="mb-4 px-4 py-3 rounded-md bg-red-900/20 border border-red-500/30 text-red-300 text-[13.5px]">{error}</div>}
                        <IssueList issues={issues} loading={loading} onSelect={openDetail} />
                        {meta && meta.last_page > 1 && (
                            <div className="flex gap-1.5 mt-4 justify-center">
                                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                                    <button key={p}
                                        onClick={() => setFilters(f => ({ ...f, page: p }))}
                                        className={`px-3 py-1.5 rounded-md text-[13px] border transition-colors
                                            ${meta.current_page === p
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-[#161b24] border-[#2a3347] text-slate-400 hover:bg-[#242c3d]'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {view === 'new' && (
                    <>
                        <div className="mb-6">
                            <button onClick={() => setView('list')} className="text-[13px] text-slate-400 hover:text-blue-400 mb-1.5 block transition-colors">← Back</button>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-100">Submit New Issue</h1>
                        </div>
                        <IssueForm onSubmit={handleCreate} onCancel={() => setView('list')} />
                    </>
                )}

                {view === 'detail' && selected && (
                    <>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <button onClick={() => setView('list')} className="text-[13px] text-slate-400 hover:text-blue-400 mb-1.5 block transition-colors">← All Issues</button>
                                <h1 className="text-[22px] font-semibold tracking-tight text-slate-100">Issue #{selected.id}</h1>
                            </div>
                            <button onClick={() => handleDelete(selected.id)}
                                className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-md text-[13.5px] font-medium transition-colors">
                                Delete
                            </button>
                        </div>
                        <IssueDetail issue={selected} onUpdate={handleUpdate} onRegenerate={handleRegenerate} />
                    </>
                )}
            </main>
        </div>
    );
}
