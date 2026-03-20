import React from 'react'
import { useState } from 'react';
import logo from '../assets/oopsTube_logo.png'
import Login from './Login';
import SignUp from './SignUp';

const AuthLayout = () => {

    const [mode, setMode] = useState("login");


    return (
    <div className='bg-neutral-800 h-screen w-screen flex justify-center items-center px-4'>
          <div className="relative bg-neutral-800 h-[87.5%] w-full sm:w-4/5 md:w-3/5 lg:w-2/5 flex flex-col z-[2] p-4">
            <img
              src={logo}
              alt="oopsTube logo"
              className="h-1/4 mb-4 w-full object-contain"
            />
            {mode=== 'login' ? <Login mode={mode} setMode={setMode}/> : <SignUp mode={mode} setMode={setMode}/>}
          </div>
        </div>
  )
}

export default AuthLayout