import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    light: 'light',
    astro: 'astro',
    cyberpunk: 'cyberpunk',
    forest: 'forest',
    sunset: 'sunset',
    ocean: 'ocean'
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme || themes.light;
    });

    useEffect(() => {
        // Remove all theme classes
        const root = document.documentElement;
        Object.values(themes).forEach(t => root.classList.remove(`theme-${t}`));

        // Add current theme class
        root.classList.add(`theme-${theme}`);
        localStorage.setItem('app-theme', theme);

        // Handle dark mode class for Tailwind 'dark:' variants if needed
        const isDark = ['astro', 'cyberpunk', 'forest', 'ocean'].includes(theme);
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
