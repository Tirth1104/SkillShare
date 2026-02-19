import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';

import { toast } from 'react-hot-toast';

const MatchPage = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('idle'); // idle, searching, matched
    const [partner, setPartner] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[MatchPage] Connected to socket server with ID:', newSocket.id);
            if (user) {
                newSocket.emit('join_user', user._id);

                // Auto-start search or targeted invite
                if (state?.targetUser) {
                    console.log(`[MatchPage] Sending direct invite to ${state.targetUser.username}`);
                    setStatus('searching');
                    newSocket.emit('send_invite', {
                        targetUserId: state.targetUser._id,
                        senderId: user._id
                    });
                    // ALSO join the search queue so the target can find us!
                    newSocket.emit('find_match', { userId: user._id, targetUserId: state.targetUser._id });
                } else if (state?.autoSearch) {
                    console.log('[MatchPage] Auto-starting search from menu...');
                    setStatus('searching');
                    newSocket.emit('find_match', { userId: user._id });
                }
            }
        });

        newSocket.on('match_found', ({ roomId, partner }) => {
            console.log('[MatchPage] Match found event received!', partner);
            setPartner(partner);
            setStatus('matched');
            toast.success(`Match found! You are paired with ${partner.username}`);
            setTimeout(() => {
                navigate(`/chat/${roomId}`, { state: { partner } });
            }, 1500);
        });

        return () => {
            console.log('[MatchPage] Disconnecting socket...');
            newSocket.disconnect();
        };
    }, [user?._id, navigate, state?.autoSearch]); // Added state?.autoSearch to deps

    const findMatch = () => {
        if (!socket) return;
        setStatus('searching');
        socket.emit('find_match', { userId: user._id || user.id });
    };

    const cancelSearch = () => {
        if (!socket) return;
        socket.emit('cancel_search');
        setStatus('idle');
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
                <h1 className="text-5xl font-extrabold mb-8 gradient-text-primary tracking-tight pb-2">
                    Find Your Skill Match
                </h1>

                <div className="bg-theme-surface p-8 rounded-3xl shadow-2xl max-w-lg w-full mb-12 border border-gray-100 dark:border-gray-800 animate-fade-in-up">
                    <div className="mb-8">
                        <h3 className="text-theme-primary font-bold text-sm uppercase tracking-widest mb-3">You teach:</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {user?.skillsTeach?.map((skill, i) => (
                                <span key={i} className="bg-theme-primary/10 text-theme-primary border border-theme-primary/20 px-4 py-1.5 rounded-2xl text-sm font-bold animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-purple-500 font-bold text-sm uppercase tracking-widest mb-3">You want to learn:</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {user?.skillsLearn?.map((skill, i) => (
                                <span key={i} className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-4 py-1.5 rounded-2xl text-sm font-bold animate-fade-in-up" style={{ animationDelay: `${i * 100 + 300}ms` }}>{skill}</span>
                            ))}
                        </div>
                    </div>

                    {status === 'idle' && (
                        <button
                            onClick={findMatch}
                            className="bg-theme-primary hover:opacity-90 text-white px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.03] w-full"
                        >
                            Find Match
                        </button>
                    )}

                    {status === 'searching' && (
                        <div className="animate-fade-in-up">
                            <div className="w-16 h-16 border-4 border-t-theme-primary border-r-purple-500 border-b-theme-primary border-l-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-xl font-bold mb-4 text-theme-text animate-pulse">Searching for a partner...</p>
                            <button onClick={cancelSearch} className="text-red-500 hover:text-red-700 dark:text-red-400 font-bold transition hover:underline">Cancel Search</button>
                        </div>
                    )}

                    {status === 'matched' && (
                        <div className="text-green-500">
                            <p className="text-2xl font-bold mb-2">Match Found!</p>
                            {partner && (
                                <p className="mb-2 text-theme-text">You are paired with <span className="font-bold">{partner.username} (★ {partner.rating?.toFixed(1) || '0.0'})</span></p>
                            )}
                            <p className="text-theme-muted">Redirecting to chat...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchPage;
