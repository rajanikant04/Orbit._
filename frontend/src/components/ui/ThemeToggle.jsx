import React from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ size = 'md', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]}
          relative overflow-hidden
          bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
          hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
          rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          group
        `}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-200" />
        
        {/* Icon container with rotation animation */}
        <div className={`
          relative z-10
          transition-transform duration-500 ease-in-out
          ${isDark ? 'rotate-0' : 'rotate-180'}
        `}>
          {isDark ? (
            <MdLightMode className={`${iconSizes[size]} text-yellow-200`} />
          ) : (
            <MdDarkMode className={`${iconSizes[size]} text-slate-200`} />
          )}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
