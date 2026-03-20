import React from 'react'
import { useState } from 'react';
import axiosInstance from '../utils/AxiosInstance';

const SignUp = ({mode, setMode}) => {
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const doLogin = () => {
        console.log("clickeddddddddddddddddddddddddddddddddddddd");
        setMode("login")
        
    }

    const SaveIt = async () => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('fullname', fullname);
  formData.append('avatar', avatar);
  formData.append('coverImage', coverImage);

  try {
    const res = await axiosInstance.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Register success:', res.data);
    // optionally set user data and navigate here
    setMode('login');
  } catch (error) {
    console.error('Register failed:', error.response?.data || error.message);
  }
};


  
    
    
    

  
    return (
      <div className="bg-stone-900 w-full flex-1 border border-neutral-600 text-white flex flex-col justify-center items-center rounded-xl shadow-md p-6">
        <h1 className='text-2xl font-bold mb-6 text-[#EAE5D6]'>Welcome back!</h1>
  
        <input
          type="email"
          placeholder="Enter email here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-4/5 h-12 p-2 mb-3 rounded bg-zinc-800 text-[#EAE5D6] placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
        />

        <input
          type="text"
          placeholder="Enter name here..."
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className='w-4/5 h-12 p-2 mb-3 rounded bg-zinc-800 text-[#EAE5D6] placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
        />
  
        <input
          type="text"
          placeholder="Enter username here..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-4/5 h-12 p-2 mb-3 rounded bg-zinc-800 text-white placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
        />
  
        <input
          type="password"
          placeholder="Enter password here..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-4/5 h-12 p-2 mb-4 rounded bg-zinc-800 text-white placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
        />

        <div className='w-4/5 h-2/5 flex flex-row justify-center items-center gap-4 p-1'>
            <div className='flex flex-col items-center w-1/2 h-5/6 bg-neutral-800 border border-violet-400 p-1 pt-2'>
                <p className='text-[#EAE5D6] font-semibold mb-1 content-center'>Upload Avatar</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className='w-full p-1 rounded bg-zinc-800 text-[#EAE5D6] placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
                />
            </div>

            <div className='flex flex-col items-center w-1/2 h-5/6 bg-neutral-800 border border-violet-400 p-1 pt-2'>
                <p className='text-[#EAE5D6] font-semibold mb-1 content-center'>Upload Cover Image</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                    className='w-full p-1 rounded bg-zinc-800 text-[#EAE5D6] placeholder:text-[#EAE5D6] border border-dashed border-violet-400'
                />
            </div>
        </div>


  
        <div className='w-4/5 mt-2 flex flex-row bg-neutral-800 justify-center items-center border border-violet-400 rounded-full'>
          <button
            type="button"
            onClick={SaveIt}
            className='w-[70%] py-2 bg-violet-300 text-neutral-800 font-bold hover:bg-violet-500 transition-all duration-200 border border-violet-400 rounded-3xl'>
            Sign Up
          </button>
  
          <button
            type="button"
            onClick={doLogin}
            className='w-[30%] py-2 bg-neutral-800 text-[#EAE5D6] font-bold hover:bg-violet-500 transition-all duration-200  rounded-3xl'>
            Login
          </button>
        </div>
      </div>
    )
}

export default SignUp