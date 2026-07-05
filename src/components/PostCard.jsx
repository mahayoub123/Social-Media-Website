import React from 'react';
import { Edit3, Trash2, Calendar } from 'lucide-react';

export default function PostCard({ post, currentUser, onEditClick, onDeleteClick }) {
  const isOwner = currentUser && post.userId === currentUser.id;

  const formatDate = (dateString) => {
    try {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('ar-EG', options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-md hover:border-slate-700/60 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 border border-slate-700"
          />
          <div className="text-right">
            <h4 className="font-bold text-slate-100 text-sm md:text-base">{post.author}</h4>
            <p className="text-xs text-slate-400">@{post.username}</p>
          </div>
        </div>

        {/* Action Buttons for Owner */}
        {isOwner && (
          <div className="flex gap-1">
            <button
              onClick={() => onEditClick(post)}
              className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800/50 rounded-lg transition-all"
              title="Edit Post"
            >
              <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => onDeleteClick(post.id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 text-right">
        <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Date */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-500 justify-start">
        <Calendar className="w-3.5 h-3.5" />
        <span>{formatDate(post.createdAt)}</span>
      </div>
    </div>
  );
}
