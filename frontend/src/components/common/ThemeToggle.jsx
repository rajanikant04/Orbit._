import { useTheme } from '../../contexts/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

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
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative rounded-xl
        bg-white/5 hover:bg-white/10
        dark:bg-white/5 dark:hover:bg-white/10
        light:bg-black/5 light:hover:bg-black/10
        border border-white/10 hover:border-white/20
        dark:border-white/10 dark:hover:border-white/20
        light:border-black/10 light:hover:border-black/20
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        group overflow-hidden
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Icon container with rotation animation */}
      <div className="relative flex items-center justify-center w-full h-full">
        <div className={`
          absolute transition-all duration-500 ease-out
          ${isDark ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75'}
        `}>
          <MdDarkMode className={`${iconSizes[size]} text-white/80 group-hover:text-white transition-colors duration-200`} />
        </div>
        
        <div className={`
          absolute transition-all duration-500 ease-out
          ${isDark ? 'rotate-180 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}
        `}>
          <MdLightMode className={`${iconSizes[size]} text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200`} />
        </div>
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 transform scale-0 group-active:scale-100 transition-transform duration-150 rounded-xl" />
      </div>
    </button>
  );
};

export default ThemeToggle;
