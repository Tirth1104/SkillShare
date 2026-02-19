import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Search, User as UserIcon, Star, MessageSquare, Plus, Sparkles, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Explore = () => {
    const { user: currentUser, updateUserProfile } = useAuth();
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);

    const navigate = useNavigate();

    // Fetch all skills for the "Skills Pool"
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await api.get('/auth/skills');
                setSkills(data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
        fetchSkills();
    }, []);

    // Fetch users (initial or filtered)
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            try {
                const url = selectedSkill
                    ? `/auth/users?skill=${encodeURIComponent(selectedSkill)}`
                    : '/auth/users';
                const { data } = await api.get(url);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
                setUsersLoading(false);
            }
        };
        fetchUsers();
    }, [selectedSkill]);

    const handleInvite = (user) => {
        navigate('/match', { state: { targetUser: user, autoSearch: true } });
    };

    const toggleSkill = (skillName) => {
        if (selectedSkill === skillName) {
            setSelectedSkill(null);
        } else {
            setSelectedSkill(skillName);
            setSearchTerm('');
        }
    };

    const handleAddMySkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        setIsAddingSkill(true);
        try {
            const updatedSkills = [...(currentUser.skillsTeach || []), newSkill.trim()];
            await updateUserProfile({ ...currentUser, skillsTeach: updatedSkills });

            // Update local skills pool if not already there
            setSkills(prev => {
                const exists = prev.find(s => s.name.toLowerCase() === newSkill.trim().toLowerCase());
                if (exists) {
                    return prev.map(s => s.name.toLowerCase() === newSkill.trim().toLowerCase() ? { ...s, count: s.count + 1 } : s);
                }
                return [...prev, { name: newSkill.trim(), count: 1 }].sort((a, b) => b.count - a.count);
            });

            setNewSkill('');
            toast.success(`"${newSkill}" added to your skills!`);
        } catch (error) {
            toast.error("Failed to add skill");
        } finally {
            setIsAddingSkill(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const query = searchTerm.toLowerCase();
        return u.username.toLowerCase().includes(query) ||
            u.skillsTeach.some(s => s.toLowerCase().includes(query)) ||
            u.skillsLearn.some(s => s.toLowerCase().includes(query));
    });

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-12 animate-text-focus-in">
                    <h1 className="text-6xl font-black mb-4 tracking-tighter">
                        <span className="gradient-text-primary">Skills</span> Explorer
                    </h1>
                    <p className="text-theme-muted text-xl font-medium max-w-2xl">
                        Browse the decentralized pool of knowledge. Find mentors, collaborators, and lifelong learners.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar: Skills Pool */}
                    <div className="lg:col-span-1 space-y-8 animate-fade-in-up">
                        <div className="bg-theme-surface/30 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-theme-primary mb-6 flex items-center gap-2">
                                <Sparkles size={16} /> Skills Pool
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {skills.map((skill, i) => (
                                    <button
                                        key={skill.name}
                                        onClick={() => toggleSkill(skill.name)}
                                        className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2
                                            ${selectedSkill === skill.name
                                                ? 'bg-theme-primary text-white animate-pulse-neon shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]'
                                                : 'bg-theme-surface/50 border border-white/5 text-theme-muted hover:border-theme-primary/30 hover:text-theme-text'}`}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        {skill.name}
                                        <span className={`text-[10px] px-1.5 rounded-lg ${selectedSkill === skill.name ? 'bg-white/20' : 'bg-theme-primary/10 text-theme-primary'}`}>
                                            {skill.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleAddMySkill} className="relative group">
                                <input
                                    type="text"
                                    placeholder="Got a unique skill?"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="w-full bg-theme-bg/50 border border-white/5 rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:border-theme-primary/50 transition-all text-sm font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={isAddingSkill || !newSkill.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-theme-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
                                >
                                    <Plus size={18} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content: Users Section */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center animate-fade-in-up [--delay:200ms]">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={20} />
                                <input
                                    type="text"
                                    placeholder={`Search in ${selectedSkill || 'all skills'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-3xl bg-theme-surface border border-white/5 focus:outline-none focus:border-theme-primary/30 shadow-2xl transition-all text-theme-text"
                                />
                            </div>
                            {selectedSkill && (
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className="px-6 py-4 rounded-3xl bg-theme-primary/10 text-theme-primary font-bold border border-theme-primary/20 hover:bg-theme-primary/20 transition flex items-center gap-2"
                                >
                                    <Filter size={18} /> Clear: {selectedSkill}
                                </button>
                            )}
                        </div>

                        {/* Results Grid */}
                        {loading || usersLoading ? (
                            <div className="flex justify-center items-center h-96">
                                <div className="w-16 h-16 border-4 border-t-theme-primary border-r-purple-500 border-b-theme-primary border-l-purple-500 rounded-full animate-spin"></div>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredUsers.map((u, index) => (
                                    <div
                                        key={u._id}
                                        className="glass-card glass-card-hover rounded-[2.5rem] p-8 transition-all duration-500 animate-fade-in-up flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-theme-primary to-purple-600 p-[2px]">
                                                        <div className="w-full h-full bg-theme-bg rounded-[1.3rem] flex items-center justify-center text-2xl font-black text-white">
                                                            {u.username[0].toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black tracking-tight group-hover:text-theme-primary transition-colors">{u.username}</h3>
                                                        <div className="flex items-center text-sm font-bold gap-3">
                                                            <span className="flex items-center text-yellow-500">
                                                                <Star size={14} className="fill-yellow-500 mr-1" /> {u.rating.toFixed(1)}
                                                            </span>
                                                            <span className="text-theme-muted opacity-60">
                                                                {u.sessionsCompleted} sessions
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-3 h-3 rounded-full ${u.isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/10'}`}></div>
                                            </div>

                                            <div className="space-y-6 mb-10">
                                                <div>
                                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-theme-primary opacity-80 block mb-3">Teaches</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {u.skillsTeach.map(s => (
                                                            <span key={s} className="px-4 py-1.5 bg-theme-primary/10 border border-theme-primary/20 text-theme-primary text-xs font-bold rounded-xl">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-purple-500 opacity-80 block mb-3">Wants to learn</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {u.skillsLearn.map(s => (
                                                            <span key={s} className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold rounded-xl">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleInvite(u)}
                                            className="w-full py-4 bg-theme-primary text-white font-black rounded-2xl hover:opacity-90 transform active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-theme-primary/20"
                                        >
                                            <MessageSquare size={20} /> Send Invite
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[3rem] animate-fade-in-up">
                                <Search size={64} className="text-theme-muted opacity-20 mb-6" />
                                <h3 className="text-3xl font-black mb-3">No matches found</h3>
                                <p className="text-theme-muted max-w-sm text-center">
                                    Try selecting a different skill from the pool or clearing your search.
                                </p>
                                <button
                                    onClick={() => { setSelectedSkill(null); setSearchTerm(''); }}
                                    className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;
