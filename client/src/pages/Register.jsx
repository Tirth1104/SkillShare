import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // For skills, simple text input for now, ideally strictly typed tags
    const [skillsTeach, setSkillsTeach] = useState('');
    const [skillsLearn, setSkillsLearn] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            await register({
                username,
                email,
                password,
                skillsTeach: skillsTeach.split(',').map(s => s.trim()), // basic CSV parsing
                skillsLearn: skillsLearn.split(',').map(s => s.trim())
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-theme-bg text-theme-text transition-colors duration-200 py-12">
            <div className="bg-theme-surface p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-theme-primary to-purple-600 text-transparent bg-clip-text">Register</h2>
                {error && <p className="text-red-500 mb-6 bg-red-500/10 p-3 rounded-lg text-sm font-semibold border border-red-500/20">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-theme-muted">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-theme-muted">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-theme-muted">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-theme-muted">Confirm</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-theme-muted">Skills to Teach</label>
                        <input type="text" value={skillsTeach} onChange={(e) => setSkillsTeach(e.target.value)} placeholder="React, Python..." className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-theme-muted">Skills to Learn</label>
                        <input type="text" value={skillsLearn} onChange={(e) => setSkillsLearn(e.target.value)} placeholder="Guitar, Cooking..." className="w-full px-4 py-2.5 rounded-xl bg-theme-bg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all text-theme-text" />
                    </div>
                    <button type="submit" className="w-full bg-theme-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg transform hover:scale-[1.02] active:scale-95 mt-4">
                        Create Account
                    </button>
                </form>
                <p className="mt-8 text-center text-theme-muted font-medium">
                    Already have an account? <Link to="/login" className="text-theme-primary hover:underline font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
