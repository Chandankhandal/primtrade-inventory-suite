import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);

    const { loginUser, registerUser, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || (!isLogin && !name)) {
            toast.error("Please fill in all required operational fields.");
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await loginUser(email, password);
                toast.success("Welcome back! Loading your analytics workspace...");
            } else {
                await registerUser(name, email, password, role);
                toast.success("Account compiled successfully! Dashboard unlocked.");
            }
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Authentication transmission failed.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">

                
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white block">
                        {isLogin ? 'Sign in to your account' : 'Create your credentials'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 block">
                        {isLogin ? "Need access to the multiple-vendor suite?" : "Join the administrative platform"}
                    </p>
                </div>

                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">

                        
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                    placeholder="Chandan Kumar"
                                />
                            </div>
                        )}

                        
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                placeholder="developer@example.com"
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">Account Workspace Access</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm cursor-pointer font-medium"
                                >
                                    <option value="user" className="bg-slate-700 text-white">Standard User (View Catalog Only)</option>
                                    <option value="admin" className="bg-slate-700 text-white">System Admin (Full inventory Management Control)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2 text-white">
                                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing Sync...
                                </span>
                            ) : isLogin ? 'Sign In' : 'Register Account'}
                        </button>
                    </div>
                </form>

                
                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-bold text-indigo-400 hover:text-indigo-300 focus:outline-none transition-colors cursor-pointer"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AuthPage;