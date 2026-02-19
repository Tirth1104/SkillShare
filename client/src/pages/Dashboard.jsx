import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Edit2, Check, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { user, updateUserProfile, checkUserLoggedIn } = useAuth();
    const [newSkillTeach, setNewSkillTeach] = useState('');
    const [newSkillLearn, setNewSkillLearn] = useState('');
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

    // Watch for theme changes and refresh profile
    useEffect(() => {
        if (checkUserLoggedIn) checkUserLoggedIn();

        // Initial check with a small delay to ensure Navbar has set the class
        const timer = setTimeout(() => {
            setDarkMode(document.documentElement.classList.contains('dark'));
        }, 100);

        const observer = new MutationObserver(() => {
            setDarkMode(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    // Username editing state
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [usernameError, setUsernameError] = useState('');

    const chartData = {
        labels: ['Reputation', 'Sessions', 'Rated Sessions'],
        datasets: [
            {
                label: 'User Stats',
                data: [user?.rating || 0, user?.sessionsCompleted || 0, user?.totalRatings || 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: darkMode ? '#e5e7eb' : '#374151',
                    font: { size: 14 }
                }
            },
            title: {
                display: true,
                text: 'Your Performance',
                color: darkMode ? '#f9fafb' : '#111827',
                font: { size: 18, weight: 'bold' }
            },
        },
        scales: {
            y: {
                ticks: {
                    color: darkMode ? '#cbd5e1' : '#4b5563',
                    font: { weight: '500' }
                },
                grid: { color: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
                ticks: {
                    color: darkMode ? '#cbd5e1' : '#4b5563',
                    font: { weight: '500' },
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: { display: false }
            }
        }
    };

    const handleAddSkillTeach = async (e) => {
        e.preventDefault();
        if (!newSkillTeach.trim()) return;
        const updatedSkills = [...(user.skillsTeach || []), newSkillTeach.trim()];
        await updateUserProfile({ ...user, skillsTeach: updatedSkills });
        setNewSkillTeach('');
    };

    const handleAddSkillLearn = async (e) => {
        e.preventDefault();
        if (!newSkillLearn.trim()) return;
        const updatedSkills = [...(user.skillsLearn || []), newSkillLearn.trim()];
        await updateUserProfile({ ...user, skillsLearn: updatedSkills });
        setNewSkillLearn('');
    };

    const handleUpdateUsername = async () => {
        if (!newUsername.trim() || newUsername === user.username) {
            setIsEditingUsername(false);
            return;
        }

        try {
            await updateUserProfile({ ...user, username: newUsername });
            setIsEditingUsername(false);
            setUsernameError('');
        } catch (error) {
            setUsernameError('Username taken or invalid');
        }
    };

    const cancelEditUsername = () => {
        setIsEditingUsername(false);
        setNewUsername(user?.username || '');
        setUsernameError('');
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto p-8">
                {/* [0] Welcome Header Section */}
                <div className="mb-10 flex items-center space-x-4 animate-text-focus-in">
                    <h1 className="text-4xl font-extrabold tracking-tight">Welcome,</h1>

                    {isEditingUsername ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="px-3 py-1.5 rounded-xl bg-theme-surface border border-gray-300 dark:border-gray-600 focus:outline-none text-theme-text shadow-sm"
                            />
                            <button onClick={handleUpdateUsername} className="text-green-600 hover:text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-xl transition">
                                <Check size={20} />
                            </button>
                            <button onClick={cancelEditUsername} className="text-red-600 hover:text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <span className="text-4xl font-extrabold gradient-text-primary pb-1 truncate max-w-[200px] md:max-w-[400px]" title={user?.username}>{user?.username}</span>
                            <button onClick={() => { setIsEditingUsername(true); setNewUsername(user?.username); }} className="flex-shrink-0 text-theme-muted hover:text-theme-primary transition p-2 hover:bg-theme-surface rounded-xl">
                                <Edit2 size={24} />
                            </button>
                        </div>
                    )}
                    <span className="text-4xl animate-bounce">👋</span>
                </div>
                {usernameError && <p className="text-red-500 mb-6 -mt-6">{usernameError}</p>}

                {/* Discover New Skills Discovery Card */}
                <div className="bg-gradient-to-r from-theme-primary to-purple-600 rounded-3xl p-8 mb-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition transform hover:scale-[1.01] animate-fade-in-up [--delay:200ms]">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2 text-white">Discover New Skills 🚀</h2>
                        <p className="opacity-90 text-lg">Browse our public directory to find the perfect partner for your next exchange.</p>
                    </div>
                    <Link
                        to="/explore"
                        className="bg-white text-theme-primary px-10 py-4 rounded-2xl font-bold hover:bg-gray-100 transition shadow-xl whitespace-nowrap"
                    >
                        Explore Now
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up [--delay:400ms]">
                    <div className="bg-theme-surface p-6 rounded-3xl shadow-lg transition-all border border-gray-100 dark:border-gray-800 hover-lift">
                        <h3 className="text-xl font-bold mb-2 text-theme-primary">Reputation Score</h3>
                        <p className="text-5xl font-extrabold tracking-tight">{user?.rating?.toFixed(1) || 'N/A'}</p>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-3xl shadow-lg transition-all border border-gray-100 dark:border-gray-800 hover-lift">
                        <h3 className="text-xl font-bold mb-2 text-purple-500">Sessions Completed</h3>
                        <p className="text-5xl font-extrabold tracking-tight">{user?.sessionsCompleted || 0}</p>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-3xl shadow-lg transition-all border border-gray-100 dark:border-gray-800 hover-lift">
                        <h3 className="text-xl font-bold mb-3 text-orange-500">Skills Taught</h3>
                        <div className="flex flex-wrap gap-2 mt-2 mb-6">
                            {user?.skillsTeach?.map((skill, i) => (
                                <span key={i} className="bg-theme-primary/10 text-theme-primary border border-theme-primary/20 px-3 py-1 rounded-xl text-sm font-bold">{skill}</span>
                            )) || <span className="text-theme-muted">None</span>}
                        </div>
                        <form onSubmit={handleAddSkillTeach} className="flex gap-2">
                            <input
                                type="text"
                                value={newSkillTeach}
                                onChange={(e) => setNewSkillTeach(e.target.value)}
                                placeholder="Add skill..."
                                className="w-full px-4 py-2 rounded-xl bg-theme-bg border border-gray-100 dark:border-gray-700 focus:outline-none text-theme-text placeholder-theme-muted shadow-inner"
                            />
                            <button type="submit" className="bg-theme-primary hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold transition shadow-md">+</button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-theme-surface p-6 rounded-lg shadow-lg transition-colors min-h-[400px] border border-gray-100 dark:border-gray-700">
                        <Bar options={{ ...options, maintainAspectRatio: false }} data={chartData} height={350} />
                    </div>
                    <div className="bg-theme-surface p-6 rounded-lg shadow-lg transition-colors border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-pink-500">Skills You Want to Learn</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {user?.skillsLearn?.map((skill, i) => (
                                <span key={i} className="bg-pink-500/20 text-pink-500 border border-pink-500/30 px-2 py-1 rounded text-sm font-medium">{skill}</span>
                            )) || <span className="text-theme-muted">None</span>}
                        </div>
                        <form onSubmit={handleAddSkillLearn} className="flex gap-2">
                            <input
                                type="text"
                                value={newSkillLearn}
                                onChange={(e) => setNewSkillLearn(e.target.value)}
                                placeholder="Add skill..."
                                className="w-full px-2 py-1 rounded bg-theme-bg border border-gray-300 dark:border-gray-600 focus:outline-none text-theme-text placeholder-theme-muted"
                            />
                            <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded">+</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
