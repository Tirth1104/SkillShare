import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Users, Zap, Shield, TrendingUp, ArrowRight, Star, Globe, MessageCircle } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    const [stats, setStats] = useState({
        userCount: 0,
        skillsCount: 0,
        sessionsCompleted: 0,
        avgRating: 4.8 // Keep hardcoded or implement if needed, simpler to keep for now as plan didn't specify avg rating backend logic deeply
    });

    useEffect(() => {
        setIsVisible(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/auth/public-stats');
            setStats(prev => ({
                ...prev,
                userCount: res.data.userCount || 0,
                skillsCount: res.data.skillsCount || 0,
                sessionsCompleted: res.data.sessionsCompleted || 0
            }));
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        }
    };

    const features = [
        {
            icon: <Zap size={32} className="text-yellow-400" />,
            title: "Instant Matchmaking",
            description: "Get paired with skilled individuals in seconds using our smart matching algorithm."
        },
        {
            icon: <Shield size={32} className="text-green-400" />,
            title: "Verified Skills",
            description: "Community-driven reputation system ensures you learn from the best."
        },
        {
            icon: <MessageCircle size={32} className="text-pink-400" />,
            title: "Real-time Chat",
            description: "Seamless communication with your study partners directly in the app."
        }
    ];

    const statsDisplay = [
        { label: "Active Users", value: stats.userCount },
        { label: "Skills Shared", value: stats.skillsCount + "+" },
        { label: "Sessions Completed", value: stats.sessionsCompleted + "+" },
        { label: "Avg. Rating", value: "4.8/5" }
    ];

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 overflow-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-20 pb-32 flex content-center items-center justify-center min-h-[90vh]">
                <div className="absolute top-0 w-full h-full bg-center bg-cover opacity-20 dark:opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                </div>

                {/* Background decorative blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className={`container relative mx-auto px-4 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
                            <div className="">
                                <h1 className="text-white font-extrabold text-5xl md:text-7xl mb-6 leading-tight">
                                    Master New Skills. <br />
                                    <span className="gradient-text-primary">Together.</span>
                                </h1>
                                <p className="mt-4 text-lg md:text-2xl text-gray-300 font-light mb-10 max-w-3xl mx-auto">
                                    The ultimate platform for peer-to-peer skill exchange. Teach what you know, learn what you love, and grow with a community of passionate learners.
                                </p>

                                <div className="flex flex-col md:flex-row justify-center gap-4">
                                    {user ? (
                                        <Link to="/dashboard" className="bg-theme-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform flex items-center justify-center gap-2">
                                            Go to Dashboard <ArrowRight size={20} />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link to="/register" className="bg-theme-primary text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform flex items-center justify-center gap-2">
                                                Get Started <Zap size={20} />
                                            </Link>
                                            <Link to="/login" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-white/20 transition transform">
                                                Login
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="pb-20 bg-theme-bg -mt-24 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full lg:w-10/12 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {statsDisplay.map((stat, index) => (
                                    <div key={index} className="bg-theme-surface p-6 rounded-2xl shadow-xl text-center transform hover:-translate-y-2 transition duration-300 border border-theme-border glass-card">
                                        <h3 className="text-3xl md:text-4xl font-bold gradient-text-primary mb-1">{stat.value}</h3>
                                        <p className="text-theme-muted font-medium text-sm uppercase tracking-wide">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-theme-surface">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center text-center mb-16">
                        <div className="w-full lg:w-6/12 px-4">
                            <h2 className="text-4xl font-semibold mb-4 text-theme-text">Why Choose SkillShare?</h2>
                            <p className="text-lg leading-relaxed m-4 text-theme-muted">
                                We've built a platform focused on genuine interactions and real skill acquisition. Here's what makes us different.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {features.map((feature, index) => (
                            <div key={index} className="w-full md:w-6/12 lg:w-3/12 px-4 mb-8">
                                <div className="px-6 py-8 rounded-3xl shadow-lg bg-theme-bg hover:shadow-2xl transition duration-300 h-full border border-gray-100 dark:border-gray-800 hover-lift group">
                                    <div className="p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-5 shadow-md rounded-full bg-theme-surface group-hover:scale-110 transition duration-300">
                                        {feature.icon}
                                    </div>
                                    <h6 className="text-xl font-bold mb-2 text-theme-text">{feature.title}</h6>
                                    <p className="mb-4 text-theme-muted leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 bg-theme-bg">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-2xl rounded-3xl bg-gradient-to-r from-theme-primary to-purple-600 overflow-hidden">
                        <div className="w-full h-full absolute opacity-20 bg-pattern"></div>
                        <div className="flex-auto p-10 lg:p-16 text-center text-white relative z-10">
                            <h3 className="text-4xl font-bold mb-4">Ready to start your journey?</h3>
                            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                                Join our community today and start exchanging skills with people from around the world. It's free, fun, and improved daily.
                            </p>
                            <Link to="/register" className="bg-white text-theme-primary font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-100 transition transform hover:-translate-y-1 inline-block">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-theme-surface border-t border-theme-border">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-theme-muted">
                        © {new Date().getFullYear()} SkillShare. All rights reserved. <br />
                        <span className="text-sm opacity-75">Built for learners, by learners.</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
