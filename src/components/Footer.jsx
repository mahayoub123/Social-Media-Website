import React from 'react';
import { Share2, Heart, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-slate-900 mt-auto py-8 px-6 md:px-12 text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Share2 className="text-purple-400 w-5 h-5" />
          <span className="font-bold text-slate-200">Cobtact</span>
          <span className="text-xs">| Your Social Platform for Creative Communication</span>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-purple-400 transition-colors duration-200">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors duration-200">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors duration-200">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        {/* Info / Copyright */}
        <div className="flex items-center gap-1 text-xs md:text-sm">
          <span>Developed by Full-Stack Web Developer</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>Eng:Mahmoud Ayoub</span>
          <span>in 2026</span>
        </div>
      </div>
    </footer>
  );
}
