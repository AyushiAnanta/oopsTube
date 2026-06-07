import React, { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { Mail, User, Lock, ArrowLeft, Image as ImageIcon, CheckCircle } from 'lucide-react';

const SignUp = ({ setMode }) => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const doLogin = () => {
    setMode("login");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !fullname || !username || !password || !avatar) {
      setErrorMsg("Please fill all required fields, including Avatar.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('fullname', fullname);
    formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      await axiosInstance.post('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setTimeout(() => setMode('login'), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <CheckCircle className="text-green-400 w-20 h-20 mb-4 animate-slide-up" />
        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
        <p className="text-gray-400">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-8 relative">
        <button 
          onClick={doLogin}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
          title="Back to Login"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
        <p className="text-gray-400">Join OopsTube today</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
              <span className="text-lg font-bold">@</span>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Avatar Upload */}
          <div className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full py-4 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${avatar ? 'border-brand-400 bg-brand-400/10' : 'border-dark-600 bg-dark-900/50 group-hover:border-brand-500'}`}>
              <ImageIcon size={24} className={avatar ? 'text-brand-400' : 'text-gray-500'} />
              <span className="text-sm font-medium text-gray-300">
                {avatar ? 'Avatar Selected' : 'Upload Avatar *'}
              </span>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full py-4 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${coverImage ? 'border-brand-400 bg-brand-400/10' : 'border-dark-600 bg-dark-900/50 group-hover:border-brand-500'}`}>
              <ImageIcon size={24} className={coverImage ? 'text-brand-400' : 'text-gray-500'} />
              <span className="text-sm font-medium text-gray-300">
                {coverImage ? 'Cover Selected' : 'Upload Cover (Optional)'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUp;