import { useState } from 'react';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onLogin({ email, password });
        } catch (err) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-950/95 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.55)]">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-700/20 text-blue-300 text-2xl">⚡</div>
                    <h1 className="mt-6 text-3xl font-semibold text-slate-100">Sign in to IssueOps</h1>
                    <p className="mt-2 text-sm text-slate-500">Use your email and password to access the issue tracker.</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-300">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-300">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">If you do not have credentials yet, ask your administrator for access.</p>
            </div>
        </div>
    );
}
