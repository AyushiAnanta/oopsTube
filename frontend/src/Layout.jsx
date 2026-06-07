import React, { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import oopsTubelogo from './assets/oopsTube_logo.png';
import { AuthContext } from './AuthContext';
import axiosInstance from './utils/AxiosInstance';
import { Home, Compass, PlaySquare, Clock, User as UserIcon, Search, MessageSquare, Users } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(AuthContext);

  const logout = async () => {
    try {
      await axiosInstance.post('/users/logout', {});
      setUserData(null);
      navigate('/');
    } catch (error) {
      console.log('Logout failed', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-gray-100 font-sans">
      {/* Sticky Top Navbar */}
      <nav className="fixed top-0 w-full h-[10vh] min-h-[64px] glass-panel z-50 flex items-center justify-between px-6 transition-all duration-300">
        <Link to="/home" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img src={oopsTubelogo} alt="OopsTube Logo" className="h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">OopsTube</span>
        </Link>
        
        <div className="flex-1 max-w-2xl px-4 hidden md:flex items-center justify-center">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value;
              if(query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
            className="w-full relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-brand-400 transition-colors" />
            </div>
            <input 
              name="search"
              type="text" 
              placeholder="Search videos..." 
              className="w-full bg-dark-800/80 border border-dark-700/50 text-white rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:border-brand-500 focus:bg-dark-800 transition-all placeholder-gray-500 shadow-inner"
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          {userData ? (
            <button
              onClick={logout}
              className="px-5 py-2 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link to="/">
              <button className="px-5 py-2 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-500 transition-all duration-300 active:scale-95">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 mt-[10vh]">
        {/* Sidebar (Visible on md and larger) */}
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-[10vh] h-[90vh] bg-dark-900 border-r border-dark-700/50 p-4 space-y-2 overflow-y-auto">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Home" 
            to="/home" 
          />
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="Community" 
            to="/community" 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Subscriptions" 
            to="/subscriptions" 
          />
          <hr className="border-dark-700 my-4" />
          <SidebarItem 
            icon={<UserIcon size={20} />} 
            label="Profile" 
            to="/profile" 
          />
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, to }) => {
  const location = useLocation();
  const active = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-dark-700 text-white' 
          : 'text-gray-400 hover:bg-dark-800 hover:text-white'
      }`}
    >
      <span className={`transition-colors ${active ? 'text-brand-400' : 'group-hover:text-brand-400'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Layout;
