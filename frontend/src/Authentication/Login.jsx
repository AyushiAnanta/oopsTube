import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axiosInstance from '../utils/AxiosInstance';
import { Mail, User, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = ({ setMode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  const doSignUp = () => {
    setMode('signUp');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username && !email) {
      setErrorMsg('Please enter username or email');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter a password');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axiosInstance.post('/users/login', {
        username,
        email,
        password,
      });
      setUserData(res.data);
      navigate('/home');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-400">Enter your details to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
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
              placeholder="Username (optional)"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Don't have an account?{' '}
        <button
          onClick={doSignUp}
          className="text-brand-400 hover:text-brand-300 font-semibold hover:underline inline-flex items-center gap-1 transition-colors"
        >
          Sign up now <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Login;
