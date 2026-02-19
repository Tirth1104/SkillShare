import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Search, User as UserIcon, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/auth/users');
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const query = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(query) ||
            user.skillsTeach.some(s => s.toLowerCase().includes(query)) ||
            user.skillsLearn.some(s => s.toLowerCase().includes(query))
        );
    });

    const handleInvite = (user) => {
        // Direct to match page with potential auto-search or just open a chat
        // For now, let's just toast or navigate to match
        navigate('/match', { state: { targetUser: user, autoSearch: true } });
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-theme-primary to-purple-600 dark:from-theme-primary dark:to-purple-500 text-transparent bg-clip-text">
                            Explore Skills
                        </h1>
                        <p className="text-theme-muted mt-2 font-medium">Find the perfect partner to exchange knowledge with.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Search skills or usernames..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-theme-surface border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary shadow-sm transition-all text-theme-text placeholder-theme-muted"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="bg-theme-surface rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-theme-primary to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-theme-primary transition-colors uppercase tracking-tight">
                                                {user.username}
                                            </h3>
                                            <div className="flex items-center text-yellow-500 text-sm font-semibold">
                                                < Star size={14} className="fill-yellow-500 mr-1" />
                                                {user.rating?.toFixed(1) || '0.0'}
                                                <span className="text-theme-muted font-normal ml-2">({user.sessionsCompleted || 0} sessions)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                </div>

                                <div className="space-y-4 mb-6 text-theme-text">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-theme-muted mb-2 tracking-widest opacity-70">Teaches</p>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skillsTeach?.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-theme-primary/10 text-theme-primary text-xs font-semibold rounded-full border border-theme-primary/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-theme-muted mb-2 tracking-widest opacity-70">Wants to Learn</p>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skillsLearn?.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-purple-500/10 text-purple-500 text-xs font-semibold rounded-full border border-purple-500/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleInvite(user)}
                                    className="w-full py-3 bg-theme-primary text-white font-bold rounded-2xl hover:opacity-90 transition duration-200 flex items-center justify-center space-x-2 shadow-sm"
                                >
                                    <MessageSquare size={18} />
                                    <span>Send Invite</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-theme-surface rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-theme-muted text-xl font-medium">No partners found matching "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="mt-4 text-theme-primary hover:underline">Clear search</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
