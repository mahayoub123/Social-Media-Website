import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة إرسال الرسالة لمدة ثانية واحدة
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => setIsSent(false), 5000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 md:px-8 text-right" dir="rtl">

      {/* Intro */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent inline-block">
          Contact us
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Do you have a question, suggestion, or encountered a problem? Do not hesitate to contact us. Our team will do their best to respond to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Contact Info Cards */}
        <div className="lg:col-span-4 space-y-4 order-last lg:order-first">
          <div className="glass rounded-2xl p-6 border border-slate-800/80 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <span>Contact information</span>
            </h3>

            {/* Email */}
            <div className="flex items-start gap-4">
              <span className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs text-slate-400">Email</h4>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">support@tawasal.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <span className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs text-slate-400">Phone</h4>
                <p className="text-sm font-semibold text-slate-200 mt-0.5" dir="ltr">+966 50 123 4567</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <span className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs text-slate-400">Location</h4>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8">
          <div className="glass rounded-2xl p-6 md:p-8 border border-slate-800/80 shadow-lg relative">

            {/* Success Alert */}
            {isSent && (
              <div className="absolute inset-0 bg-slate-950/95 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-10 border border-emerald-500/30 animate-in fade-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Thank you for contacting us. Your message has been received successfully and our support team will respond to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-6 px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition"
                >
                  Send another message
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-300">الاسم الكامل</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-slate-200 placeholder-slate-600 text-sm transition-all focus:border-purple-500/80"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs md:text-sm font-medium text-slate-300">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-slate-200 placeholder-slate-600 text-sm text-left transition-all focus:border-purple-500/80"
                    placeholder="yourname@domain.com"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs md:text-sm font-medium text-slate-300">عنوان الموضوع</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-slate-200 placeholder-slate-600 text-sm transition-all focus:border-purple-500/80"
                  placeholder="What is the subject of your inquiry?"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-xs md:text-sm font-medium text-slate-300">نص الرسالة</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-32 glass-input px-4 py-3 rounded-xl text-slate-200 placeholder-slate-600 text-sm transition-all focus:border-purple-500/80 resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-purple-500/10 transition-all duration-300"
                >
                  <Send className="w-4 h-4 rotate-180" />
                  {loading ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
