import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Calendar, Star } from 'lucide-react';

const InboxPage = () => {
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

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text font-sans transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                    <div className="grid gap-5">
                        {chats.map((chat, index) => {
                            const partner = getPartner(chat.participants);
                            return (
                                <Link
                                    key={chat._id}
                                    to={`/chat/${chat._id}`}
                                    state={{ partner: { username: partner.username, id: partner._id } }}
                                    className="block bg-theme-surface border border-gray-100 dark:border-gray-800 rounded-3xl p-6 transition-all shadow-md group hover-lift hover:border-theme-primary/40 animate-fade-in-up"
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
                                            <div>
                                                <h3 className="font-bold text-xl group-hover:text-theme-primary transition-colors flex items-center gap-2">
                                                    {partner.username}
                                                    <span className="flex items-center text-yellow-500 text-sm font-semibold bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                                        <Star size={12} className="fill-yellow-500 mr-1" />
                                                        {partner.rating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </h3>
                                                <p className="text-theme-muted text-sm font-medium truncate max-w-sm mt-1 opacity-80">
                                                    {chat.lastMessage || <span className="italic opacity-60">Start the conversation...</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-theme-muted flex flex-col items-end font-semibold opacity-70">
                                            <span className="flex items-center mb-1">
                                                <Calendar className="w-3 h-3 mr-1.5" />
                                                {new Date(chat.updatedAt).toLocaleDateString()}
                                            </span>
                                            <span>
                                                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;
