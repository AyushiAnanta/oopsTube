import React, { useState, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axiosInstance from '../utils/AxiosInstance';

const Login = ({ mode, setMode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  const doSignUp = () => {
    setMode('signUp');
  };

  const SaveIt = async () => {
    console.log(email, username, password);
    try {
      const res = await axiosInstance.post('/users/login', {
        username,
        email,
        password,
      });
      console.log('Login success:', res.data);
      setUserData(res.data);
      navigate('/profile');
    } catch (error) {
      console.log('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-stone-900 w-full flex-1 border border-neutral-600 text-white flex flex-col justify-center items-center rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#EAE5D6]">Welcome back!</h1>

      <input
        type="email"
        placeholder="Enter email here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-4/5 p-2 mb-3 rounded bg-zinc-800 text-[#EAE5D6] placeholder:text-[#EAE5D6] border border-dashed border-violet-400"
      />

      <input
        type="text"
        placeholder="Enter username here..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-4/5 p-2 mb-3 rounded bg-zinc-800 text-white placeholder:text-[#EAE5D6] border border-dashed border-violet-400"
      />

      <input
        type="password"
        placeholder="Enter password here..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-4/5 p-2 mb-6 rounded bg-zinc-800 text-white placeholder:text-[#EAE5D6] border border-dashed border-violet-400"
      />

      <div className="w-4/5 mt-4 flex flex-row bg-neutral-800 justify-center items-center border border-violet-400 rounded-full">
        <button
          type="button"
          onClick={doSignUp}
          className="w-[30%] py-2 bg-neutral-800 text-[#EAE5D6] font-bold hover:bg-violet-500 transition-all duration-200 rounded-3xl"
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={SaveIt}
          className="w-[70%] py-2 bg-violet-300 text-neutral-800 font-bold hover:bg-violet-500 transition-all duration-200 border border-violet-400 rounded-3xl"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
