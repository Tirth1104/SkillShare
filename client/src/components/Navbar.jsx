import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Theme State
    const [darkMode, setDarkMode] = useState(
        // Check localStorage first, then system preference
        localStorage.getItem('themeMode') === 'dark' ||
        (!localStorage.getItem('themeMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') || 'blue');
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Apply Dark Mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('themeMode', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('themeMode', 'light');
        }
    }, [darkMode]);

    // Apply Theme Color
    useEffect(() => {
        // Remove ALL existing theme classes
        const themeClasses = ['theme-green', 'theme-orange', 'theme-astro', 'theme-cyberpunk', 'theme-forest', 'theme-sunset', 'theme-ocean'];
        document.documentElement.classList.remove(...themeClasses);

        // Add new theme class if not default blue
        if (themeColor !== 'blue') {
            document.documentElement.classList.add(`theme-${themeColor}`);
        }

        localStorage.setItem('themeColor', themeColor);
    }, [themeColor]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        await logout();
        setShowLogoutModal(false);
        navigate('/login');
    };

    const themeColors = [
        { name: 'blue', label: 'Default (Blue)', color: 'bg-blue-600' },
        { name: 'green', label: 'Green', color: 'bg-green-600' },
        { name: 'orange', label: 'Orange', color: 'bg-orange-600' },
        { name: 'astro', label: 'Astro', color: 'bg-indigo-600' },
        { name: 'cyberpunk', label: 'Cyberpunk', color: 'bg-pink-600' },
        { name: 'forest', label: 'Forest', color: 'bg-emerald-700' },
        { name: 'sunset', label: 'Sunset', color: 'bg-purple-700' },
        { name: 'ocean', label: 'Ocean', color: 'bg-cyan-600' }
    ];

    return (
        <>
            <nav className="bg-[var(--nav-bg)] p-4 shadow-md transition-colors duration-200 relative z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-theme-primary">
                        SkillShare
                    </Link>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex space-x-6">
                            {user ? (
                                <>
                                    <Link to="/dashboard" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/dashboard' ? 'text-theme-primary' : 'text-theme-muted'}`}>Dashboard</Link>
                                    <Link to="/explore" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/explore' ? 'text-theme-primary' : 'text-theme-muted'}`}>Explore</Link>
                                    <Link to="/match" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/match' ? 'text-theme-primary' : 'text-theme-muted'}`}>Find Match</Link>
                                    <Link to="/inbox" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/inbox' ? 'text-theme-primary' : 'text-theme-muted'}`}>Inbox</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/' ? 'text-theme-primary' : 'text-theme-muted'}`}>Home</Link>
                                    <Link to="/login" className="hover:text-theme-primary font-semibold transition text-theme-muted">Login</Link>
                                    <Link to="/register" className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:opacity-90 transition font-semibold shadow-md">Get Started</Link>
                                </>
                            )}
                        </div>

                        {/* Theme Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowThemeMenu(!showThemeMenu)}
                                className="flex items-center space-x-1 focus:outline-none"
                            >
                                <div className={`w-6 h-6 rounded-full border-2 border-theme-border ${themeColor === 'blue' ? 'bg-blue-600' :
                                    themeColor === 'green' ? 'bg-green-600' :
                                        themeColor === 'orange' ? 'bg-orange-600' :
                                            themeColor === 'astro' ? 'bg-indigo-600' :
                                                themeColor === 'cyberpunk' ? 'bg-pink-600' :
                                                    themeColor === 'forest' ? 'bg-emerald-700' :
                                                        themeColor === 'sunset' ? 'bg-purple-700' :
                                                            'bg-cyan-600'
                                    }`}></div>
                            </button>

                            {showThemeMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-theme-surface rounded-lg shadow-xl py-2 border border-theme-border z-50">
                                    {themeColors.map((theme) => (
                                        <button
                                            key={theme.name}
                                            onClick={() => {
                                                setThemeColor(theme.name);
                                                setShowThemeMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-black/5 dark:hover:bg-white/10 transition"
                                        >
                                            <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                                            <span className={`text-sm ${themeColor === theme.name ? 'font-bold text-theme-text' : 'text-theme-muted'}`}>
                                                {theme.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={() => setDarkMode(!darkMode)} className="text-theme-muted hover:text-yellow-500 transition">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        {user && (
                            <>
                                <div className="flex items-center space-x-2 text-theme-muted">
                                    <User size={20} />
                                    <span>{user?.username}</span>
                                </div>
                                <button onClick={handleLogoutClick} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition">
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all scale-100">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Confirm Logout</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition shadow-lg"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
