import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-theme-bg text-theme-text transition-colors duration-200">
            <div className="bg-theme-surface p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-theme-primary to-purple-600 text-transparent bg-clip-text">Login</h2>
                {error && <p className="text-red-500 mb-6 bg-red-500/10 p-3 rounded-lg text-sm font-semibold border border-red-500/20">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-theme-muted">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text placeholder-theme-muted"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-theme-muted">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text placeholder-theme-muted pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-theme-muted hover:text-theme-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-theme-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg transform hover:scale-[1.02] active:scale-95">
                        Sign In
                    </button>
                </form>
                <p className="mt-8 text-center text-theme-muted font-medium">
                    New to SkillShare? <Link to="/register" className="text-theme-primary hover:underline font-bold">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
