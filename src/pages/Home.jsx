import React, { useState, useEffect } from 'react';
import { Send, Search, Loader2, Sparkles, MessagesSquare, AlertCircle } from 'lucide-react';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import EditPostModal from '../components/EditPostModal';

export default function Home({ currentUser, refreshCurrentUser }) {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // Loading & Action states
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal State
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Loading posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('loading users Failed');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // إضافة منشور جديد
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      setSubmittingPost(true);
      setErrorMessage('');
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (!res.ok) throw new Error('Failed to add post');

      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  // فتح مودال التعديل
  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  // حفظ المنشور المعدل
  const handleSaveEdit = async (id, updatedContent) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!res.ok) throw new Error('Failed to update post');

      const updatedPost = await res.json();
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
    } catch (err) {
      alert(err.message);
    }
  };

  // حذف منشور
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');

      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // متابعة أو إلغاء متابعة مستخدم
  const handleFollowToggle = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}/toggle-follow`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to follow user');

      const data = await res.json();

      // تحديث قائمة المستخدمين لتعديل عداد المتابعين
      setUsers(users.map(u => u.id === userId ? data.targetUser : u));

      // تحديث المستخدم الحالي ليعكس المتابعة الجديدة
      refreshCurrentUser();
    } catch (err) {
      alert(err.message);
    }
  };

  // فلترة المستخدمين بناءً على حقل البحث
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">

      {/* القسم الرئيسي: المنشورات */}
      <main className="lg:col-span-8 space-y-6">

        {/* صندوق إضافة منشور جديد */}
        {currentUser && (
          <form onSubmit={handleAddPost} className="glass rounded-2xl p-5 border border-slate-800/80 shadow-lg">
            <div className="flex gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"
              />
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none min-h-[80px] text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Share your thoughts </span>
              </div>
              <button
                type="submit"
                disabled={submittingPost || !newPostContent.trim()}
                className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-purple-500/10 transition-all duration-200"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                {submittingPost ? 'Adding post...' : 'Add post'}
              </button>
            </div>
          </form>
        )}

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* قائمة المنشورات */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 px-1">
            <MessagesSquare className="w-5 h-5 text-purple-400" />
            <span>Latest posts</span>
          </h3>

          {loadingPosts ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400 border border-slate-900">
              <p>No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeletePost}
              />
            ))
          )}
        </div>
      </main>

      {/* القسم الجانبي: البحث عن المستخدمين ومتابعتهم */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="glass rounded-2xl p-5 border border-slate-800/80 shadow-lg sticky top-24">
          <h3 className="text-base md:text-lg font-bold text-slate-200 mb-4 text-right">Discover users</h3>

          {/* حقل البحث */}
          <div className="relative mb-5" dir="rtl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full glass-input pr-10 pl-4 py-2.5 rounded-xl text-slate-200 placeholder-slate-500 text-sm transition-all focus:border-purple-500/80"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
          </div>

          {/* قائمة المستخدمين */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {loadingUsers ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-slate-500 py-4 text-sm">
                <p>No users match your search</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onFollowToggle={handleFollowToggle}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {/* نافذة تعديل المنشور المنبثقة */}
      <EditPostModal
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
