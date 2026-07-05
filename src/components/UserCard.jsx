import React, { useState } from 'react';
import { UserPlus, UserCheck, Users } from 'lucide-react';

export default function UserCard({ user, currentUser, onFollowToggle }) {
  const [isHovered, setIsHovered] = useState(false);
  const isFollowing = currentUser && currentUser.following.includes(user.id);
  const isSelf = currentUser && user.id === currentUser.id;

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700/50 transition-all duration-200">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700"
        />
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-slate-100 text-sm md:text-base leading-none">{user.name}</h4>
            {isSelf && (
              <span className="text-[10px] bg-slate-800 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/20 font-medium">أنت</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">@{user.username}</p>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1 max-w-[160px] sm:max-w-[200px]" title={user.bio}>
            {user.bio}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
            <Users className="w-3 h-3" />
            <span>{user.followers.length} Follower</span>
          </div>
        </div>
      </div>

      {/* Follow Button */}
      {!isSelf && currentUser && (
        <button
          onClick={() => onFollowToggle(user.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${isFollowing
              ? isHovered
                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/10'
            }`}
        >
          {isFollowing ? (
            isHovered ? (
              <span>unfollow</span>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>following</span>
              </>
            )
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>follow</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
