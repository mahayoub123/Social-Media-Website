import React from 'react';
import { Target, Users, Flame, Zap, Shield, HelpCircle } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'User active', value: '10K+', icon: Users, color: 'text-purple-400' },
    { label: 'Post per day', value: '25K+', icon: Flame, color: 'text-orange-400' },
    { label: 'Interaction per second', value: '500+', icon: Zap, color: 'text-yellow-400' }
  ];

  const features = [
    {
      title: 'Modern and simple interface',
      desc: 'The interface is designed to be comfortable and suitable for long-term use with support for dark mode and smooth navigation.',
      icon: Target
    },
    {
      title: 'Secure and private',
      desc: 'Your data is encrypted and fully protected, with full control over the privacy of your posts and your account.',
      icon: Shield
    },
    {
      title: 'Continuous support',
      desc: 'Our support team is available to help you and answer any questions or problems you may face 24/7.',
      icon: HelpCircle
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 md:px-8 text-right" dir="rtl">
      {/* Intro Section */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent inline-block">
          About Cobtact
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Cobtact is a creative digital space aimed at bringing people closer and sharing ideas and experiences between programmers, designers and creators in all fields.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-6 text-center border border-slate-900 shadow-lg">
              <div className="flex justify-center mb-3">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">{stat.value}</h3>
              <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Narrative Section */}
      <div className="glass rounded-2xl p-6 md:p-8 border border-slate-800/80 mb-16">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-4">Our vision and mission</h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
          We strive to provide a positive interactive environment that enables users to express their opinions and share their achievements without complex restrictions. We believe that the exchange of knowledge and experiences is the cornerstone of building strong and interconnected technical and cultural communities.
        </p>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Through our modern design and fast infrastructure, we guarantee you a unique browsing experience that focuses primarily on valuable content and building real relationships with people who share your interests.
        </p>
      </div>

      {/* Core Features */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card rounded-xl p-5 border border-slate-900/50 hover:border-purple-500/20 transition-all duration-300">
                <div className="flex justify-start mb-3">
                  <span className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2 text-sm md:text-base">{feat.title}</h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
