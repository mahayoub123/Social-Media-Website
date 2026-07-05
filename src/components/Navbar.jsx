import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Share2, User } from 'lucide-react';

export default function Navbar({ currentUser }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-purple-400 font-semibold'
      : 'text-slate-300 hover:text-white transition-colors duration-200';
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
        <Share2 className="text-purple-400 w-6 h-6 md:w-8 md:h-8" />
        <span>Cobtact</span>
      </Link>

      {/* Nav Links */}
      <div className="flex gap-6 md:gap-8 items-center text-sm md:text-base font-medium">
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/about" className={isActive('/about')}>About Us</Link>
        <Link to="/contact" className={isActive('/contact')}>Contact Us</Link>
        <Link to="/signin" className={isActive('/signin')}>Sign In</Link>
        <Link to="/signup" className={isActive('/signup')}>Sign Up</Link>

      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <div className="flex items-center gap-2 md:gap-3 bg-slate-900/60 pl-3 md:pl-4 pr-1 py-1 rounded-full border border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-slate-800 border border-purple-500/50"
            />
            <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-semibold text-slate-200">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <User className="w-5 h-5" />
            <span>Loading...</span>
          </div>
        )}
      </div>
    </nav>
  );
}
