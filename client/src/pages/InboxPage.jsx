import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Calendar, Star, Clock, CheckCircle } from 'lucide-react';

const InboxPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await api.get('/chats');
                setChats(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const getPartner = (participants) => {
        const currentUserId = (user?._id || user?.id)?.toString();
        return participants.find(p => p._id?.toString() !== currentUserId) || { username: 'Unknown' };
    };

    // Split chats into active and completed
    const activeChats = chats.filter(chat => !chat.isCompleted);
    const historyChats = chats.filter(chat => chat.isCompleted);

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text font-sans transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-5xl font-extrabold mb-10 gradient-text-primary tracking-tight pb-2 animate-text-focus-in">
                    Your Inbox
                </h1>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary"></div>
                    </div>
                ) : chats.length === 0 ? (
                    <div className="bg-theme-surface rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-xl animate-fade-in-up">
                        <MessageSquare className="mx-auto h-20 w-20 text-theme-muted mb-6 opacity-30" />
                        <h3 className="text-2xl font-bold text-theme-text mb-2">No conversations yet</h3>
                        <p className="text-theme-muted font-medium mb-8">Find a match to start exchanging skills!</p>
                        <Link to="/match" className="inline-block px-10 py-4 bg-theme-primary hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg transform hover:scale-105">
                            Start Matching
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Active Conversations Section */}
                        {activeChats.length > 0 && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <MessageSquare className="text-theme-primary" /> Active Conversations
                                </h2>
                                <div className="grid gap-5">
                                    {activeChats.map((chat, index) => {
                                        const partner = getPartner(chat.participants);
                                        return (
                                            <Link
                                                key={chat._id}
                                                to={`/chat/${chat._id}`}
                                                state={{ partner: { username: partner.username, id: partner._id } }}
                                                className="block bg-theme-surface border border-gray-100 dark:border-gray-800 rounded-3xl p-6 transition-all shadow-md group hover-lift hover:border-theme-primary/40"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="relative">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-theme-primary to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                                                {partner.username[0]?.toUpperCase()}
                                                            </div>
                                                            {partner.isOnline && (
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-theme-surface"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-xl group-hover:text-theme-primary transition-colors flex items-center gap-2 overflow-hidden">
                                                                <span className="truncate" title={partner.username}>{partner.username}</span>
                                                                <span className="flex-shrink-0 flex items-center text-yellow-500 text-sm font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                    <Star size={12} className="fill-yellow-500 mr-1" />
                                                                    {partner.rating?.toFixed(1) || '0.0'}
                                                                </span>
                                                            </h3>
                                                            <p className="text-theme-muted text-sm font-medium truncate max-w-full mt-1 opacity-80">
                                                                {chat.lastMessage || <span className="italic opacity-60">Start the conversation...</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-theme-muted flex flex-col items-end font-semibold opacity-70">
                                                        <span className="flex items-center mb-1">
                                                            <Clock className="w-3 h-3 mr-1.5" />
                                                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Match History Section */}
                        {historyChats.length > 0 && (
                            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-theme-muted/80">
                                    <CheckCircle className="text-green-500" /> Match History
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {historyChats.map((chat, index) => {
                                        const partner = getPartner(chat.participants);
                                        return (
                                            <div
                                                key={chat._id}
                                                className="bg-theme-surface/60 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:bg-theme-surface transition-colors opacity-80 hover:opacity-100 flex flex-col h-full justify-between"
                                            >
                                                <div className="flex items-center space-x-4 mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-400">
                                                        {partner.username[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-theme-text">{partner.username}</h3>
                                                        <div className="flex items-center text-xs text-theme-muted mt-1">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            Connected: {new Date(chat.updatedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => navigate(`/chat/${chat._id}`)}
                                                        className="flex-1 px-3 py-2 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary rounded-xl text-xs font-bold transition text-center"
                                                    >
                                                        Start Session
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/feedback', {
                                                            state: {
                                                                partnerId: partner._id,
                                                                username: partner.username,
                                                                roomId: chat._id
                                                            }
                                                        })}
                                                        className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition text-center"
                                                    >
                                                        End Session
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;
