import React, { useState } from 'react'
import { X } from 'lucide-react'
import axiosInstance from '../utils/AxiosInstance'

const AddVideoPopup = ({onClose, onAddDone}) => {

  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ thumbnail, setThumbnail] = useState('')
  const [ videoFile, setVideoFile ] = useState('')

  const OnSubmit = async () => {
    console.log('1',title,'1',description,'1',thumbnail,'1',videoFile)

    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);
        formData.append('videoFile', videoFile);

        console.log('FormData contents:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        try {
            const res = await axiosInstance.post('/videos/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            console.log('Register success:', res.data);
            onAddDone()
        } catch (error) {
            console.error('Register failed:', error.response?.data || error.message);
        }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm text-white font-bold text-3xl h-screen w-screen flex justify-center items-center'>
        <div className='h-[65vh] w-[98vw] md:w-[40vw] bg-neutral-800 m-5 p-5 flex items-center flex-col'>
            <button 
              type='button'
              onClick={onClose}
              className='right-0 font-bold flex justify-end items-start w-full'><X /></button>
            <h1 className='lg:font-bold flex justify-center text-neutral-100 text-3xl mb-[4%]'>Upload Video</h1>
            <div className='flex gap-2 justify-center items-center mx-4 w-full px-2 lg:w-[70%]'>
              <h1 className='text-sm lg:text-lg w-[30%]'>Title:</h1>
              <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-[70%] h-18 p-2 m-2 rounded bg-zinc-800 text-white font-semibold text-lg placeholder:text-[#EAE5D6] border border-dashed border-violet-400"/>
            </div>
            <div className='flex gap-2 justify-center items-center mx-4 w-full px-2 lg:w-[70%]'>
              <h1 className='text-sm lg:text-lg w-[30%]'>Description:</h1>
              <input
                type="text"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-[70%] h-18 p-2 m-2 rounded bg-zinc-800 text-white font-semibold text-lg placeholder:text-[#EAE5D6] border border-dashed border-violet-400"/>
            </div>
            <div className='flex gap-2 justify-center items-center mx-4 w-full px-2 lg:w-[70%]'>
              <h1 className='text-sm lg:text-lg w-[30%]'>Thumbnail:</h1>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-[70%] h-18 p-2 m-2 rounded bg-zinc-800 text-white font-semibold text-lg placeholder:text-[#EAE5D6] border border-dashed border-violet-400"/>
            </div>
            <div className='flex gap-2 justify-center items-center mx-4 w-full px-2 lg:w-[70%]'>
              <h1 className='text-sm lg:text-lg w-[30%]'>Video:</h1>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-[70%] h-18 p-2 m-2 rounded bg-zinc-800 text-white font-semibold text-lg placeholder:text-[#EAE5D6] border border-dashed border-violet-400"/>
            </div>
            
            <button 
              type='button'
              onClick={OnSubmit}
              className='h-12 w-[50%] sm:w-[40%] bg-violet-600 rounded-md font-bold text-md sm:text-xl text-neutral-100 mt-5 hover:bg-violet-700 hover:scale-105 transition-all duration-200'>
                Submit
            </button>

        </div>

        </div>
  )
}

export default AddVideoPopup