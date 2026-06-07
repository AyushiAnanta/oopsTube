import React, { useState } from 'react';
import logo from '../assets/oopsTube_logo.png';
import Login from './Login';
import SignUp from './SignUp';

const AuthLayout = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className='bg-dark-900 min-h-screen w-full flex relative overflow-hidden'>
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Left Column: Branding / Marketing (Hidden on small screens) */}
      <div className='hidden lg:flex flex-col justify-center items-center w-1/2 p-12 z-10'>
        <div className="max-w-md text-center animate-fade-in">
          <img src={logo} alt="oopsTube logo" className="h-24 mx-auto mb-8 object-contain drop-shadow-2xl" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to OopsTube</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            where you can upload all your oopsie videos
          </p>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className='w-full lg:w-1/2 flex justify-center items-center p-6 z-10'>
        <div className="glass-panel w-full max-w-md p-8 rounded-3xl animate-slide-up">
          <div className="lg:hidden flex justify-center mb-6">
            <img src={logo} alt="oopsTube logo" className="h-16 object-contain drop-shadow-xl" />
          </div>
          {mode === 'login' ? <Login setMode={setMode} /> : <SignUp setMode={setMode} />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;