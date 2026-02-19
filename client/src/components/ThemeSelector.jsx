import React, { useState, useRef, useEffect } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { Palette, Check } from 'lucide-react';

const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const availableThemes = [
        { id: themes.light, name: 'Default Light', color: 'bg-white', text: 'text-gray-800' },
        { id: themes.astro, name: 'Astro Dark', color: 'bg-slate-900', text: 'text-slate-100' },
        { id: themes.cyberpunk, name: 'Cyberpunk', color: 'bg-black', text: 'text-pink-500' },
        { id: themes.forest, name: 'Midnight Forest', color: 'bg-emerald-950', text: 'text-emerald-100' },
        { id: themes.sunset, name: 'Sunset Horizon', color: 'bg-indigo-950', text: 'text-orange-200' },
        { id: themes.ocean, name: 'Deep Ocean', color: 'bg-cyan-950', text: 'text-cyan-100' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Select Theme"
            >
                <Palette size={20} className="text-theme-primary" />
                <span className="hidden lg:inline font-medium text-theme-text">Theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-3 py-1">Select Appearance</p>
                    </div>
                    <div className="p-1">
                        {availableThemes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${theme === t.id
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 ${t.color}`} />
                                    <span className="font-medium text-sm">{t.name}</span>
                                </div>
                                {theme === t.id && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
