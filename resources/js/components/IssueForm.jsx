import { useState } from 'react';

const INITIAL = {
    title: '', description: '', priority: 'medium',
    category: 'bug', reporter_name: '', reporter_email: '', due_at: '',
};

const inputClass = "w-full bg-[#1e2533] border border-[#2a3347] focus:border-blue-500 rounded-md text-slate-200 px-3 py-2 text-[13.5px] outline-none transition-colors placeholder:text-slate-600";

function Field({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-[12.5px] font-medium text-slate-400 mb-1.5">{label}</label>
            {children}
            {error && <p className="text-[12px] text-red-400 mt-1">{error}</p>}
        </div>
    );
}

export default function IssueForm({ onSubmit, onCancel }) {
    const [form,    setForm]    = useState(INITIAL);
    const [errors,  setErrors]  = useState({});
    const [loading, setLoading] = useState(false);

    const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrors({}); setLoading(true);
        try {
            const body = { ...form };
            if (!body.due_at)         delete body.due_at;
            if (!body.reporter_name)  delete body.reporter_name;
            if (!body.reporter_email) delete body.reporter_email;
            await onSubmit(body);
        } catch (err) {
            setErrors(err.errors || { general: [err.message] });
        } finally { setLoading(false); }
    };

    const selectClass = `${inputClass} cursor-pointer`;

    return (
        <form onSubmit={handleSubmit} noValidate className="bg-[#161b24] border border-[#2a3347] rounded-lg p-7 max-w-2xl">
            {errors.general && (
                <div className="mb-4 px-4 py-3 rounded-md bg-red-900/20 border border-red-500/30 text-red-300 text-[13.5px]">
                    {errors.general[0]}
                </div>
            )}

            <Field label="Title *" error={errors.title?.[0]}>
                <input className={inputClass} placeholder="Short, descriptive title"
                       value={form.title} onChange={f('title')} />
            </Field>

            <Field label="Description *" error={errors.description?.[0]}>
                <textarea className={`${inputClass} resize-y leading-relaxed`} rows={5}
                          placeholder="Describe the issue in detail — what happened, when, what's the impact?"
                          value={form.description} onChange={f('description')} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Priority *" error={errors.priority?.[0]}>
                    <select className={selectClass} value={form.priority} onChange={f('priority')}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </Field>
                <Field label="Category *" error={errors.category?.[0]}>
                    <select className={selectClass} value={form.category} onChange={f('category')}>
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="security">Security</option>
                        <option value="performance">Performance</option>
                        <option value="other">Other</option>
                    </select>
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Reporter Name" error={errors.reporter_name?.[0]}>
                    <input className={inputClass} placeholder="Your name (optional)"
                           value={form.reporter_name} onChange={f('reporter_name')} />
                </Field>
                <Field label="Reporter Email" error={errors.reporter_email?.[0]}>
                    <input className={inputClass} type="email" placeholder="you@example.com (optional)"
                           value={form.reporter_email} onChange={f('reporter_email')} />
                </Field>
            </div>

            <Field label="Due Date" error={errors.due_at?.[0]}>
                <input className={inputClass} type="datetime-local"
                       value={form.due_at} onChange={f('due_at')} />
            </Field>

            <div className="font-mono text-[12.5px] text-blue-400 px-3.5 py-3 bg-blue-500/10 border border-blue-900/50 rounded-md mb-5">
                ✦ An AI summary and suggested next action will be generated automatically on submission.
            </div>

            <div className="flex gap-2.5">
                <button type="submit" disabled={loading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-[13.5px] font-medium transition-colors">
                    {loading ? 'Submitting…' : 'Submit Issue'}
                </button>
                <button type="button" onClick={onCancel}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-md text-[13.5px] transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    );
}
