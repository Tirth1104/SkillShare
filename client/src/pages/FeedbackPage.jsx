import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { Star } from 'lucide-react';

const FeedbackPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    const partnerId = state?.partnerId;
    const username = state?.username || 'User';
    const sessionId = state?.roomId || 'unknown';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!partnerId || partnerId === 'unknown') {
            return alert('Missing partner information. Cannot submit feedback.');
        }

        try {
            await api.post('/feedback', {
                toUserId: partnerId,
                rating,
                comment,
                sessionId
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || 'Failed to submit feedback';
            alert(message);
        }
    };

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-all duration-300">
            <Navbar />
            <div className="flex items-center justify-center min-h-[85vh] p-4">
                <div className="bg-theme-surface p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 dark:border-gray-800 transition-all">
                    <h2 className="text-3xl font-bold mb-4 text-theme-primary">Session Feedback</h2>
                    <p className="mb-6 text-theme-muted">How was your session with <span className="font-bold text-theme-text">{username}</span>?</p>

                    <div className="flex justify-center space-x-2 mb-8">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <Star
                                    key={index}
                                    size={40}
                                    className={`cursor-pointer transition transform hover:scale-110 ${ratingValue <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-theme-muted opacity-30'}`}
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            );
                        })}
                    </div>

                    <textarea
                        className="w-full bg-theme-bg rounded-2xl p-4 text-theme-text mb-6 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 border border-theme-border/10 shadow-inner transition-all resize-none"
                        rows="4"
                        placeholder="Share your experience (optional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-theme-primary hover:opacity-90 text-white font-bold py-4 rounded-2xl transition transform hover:scale-[1.02] shadow-xl mb-4"
                    >
                        Submit Feedback
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-theme-muted hover:text-theme-text text-sm transition-colors font-medium"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
