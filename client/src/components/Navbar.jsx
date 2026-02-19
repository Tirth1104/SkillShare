import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        await logout();
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-theme-surface p-4 shadow-md transition-colors duration-200 relative z-10 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-theme-primary">
                        SkillShare
                    </Link>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex space-x-6">
                            <Link to="/dashboard" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/dashboard' ? 'text-theme-primary' : 'text-theme-muted'}`}>Dashboard</Link>
                            <Link to="/explore" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/explore' ? 'text-theme-primary' : 'text-theme-muted'}`}>Explore</Link>
                            <Link to="/match" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/match' ? 'text-theme-primary' : 'text-theme-muted'}`}>Find Match</Link>
                            <Link to="/inbox" className={`hover:text-theme-primary font-semibold transition ${location.pathname === '/inbox' ? 'text-theme-primary' : 'text-theme-muted'}`}>Inbox</Link>
                        </div>

                        <ThemeSelector />

                        <div className="flex items-center space-x-2 text-theme-text">
                            <User size={20} />
                            <span className="hidden sm:inline">{user?.username}</span>
                        </div>
                        <button onClick={handleLogoutClick} className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition">
                            <LogOut size={20} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
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
