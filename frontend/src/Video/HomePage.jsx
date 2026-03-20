import { useEffect, useState } from 'react';
import oopsTubelogo from '../assets/oopsTube_logo.png'
import axiosInstance from '../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();

      const videoPage = (_id) => {
        console.log('loading')
        navigate(`/video`, {state: {id: _id}})
        console.log('done')
    }
  

  const [videos, setVideos] = useState([])

      const fetchAllVideos = async () => {
        
        const vid = await axiosInstance.get('/videos/video',
        )
        console.log(vid)
        setVideos(vid.data.data.docs)
    }


    useEffect(() => {
        fetchAllVideos()

    },[])
  return (
    <div id='container' className='bg-neutral-900 h-auto w-full flex flex-col relative'>
      <div id='navbar' className='bg-neutral-950 h-[12vh] w-full top-0 fixed flex justify-between px-4 py-2 z-50'>
        <img src={oopsTubelogo} className='h-full object-contain' alt='OopsTube Logo' />
        <button
          type='button'
          className='h-[70%] w-[25%] sm:w-[10%] bg-violet-600 rounded-md font-bold text-xl text-neutral-100 hover:bg-violet-700 hover:scale-105 transition-all duration-200 mt-2 mb-2'
        >
          Log Out
        </button>
      </div>

      <div id='main' className='w-full h-auto min-h-[100vh] flex mt-[12vh] bg-neutral-800'>
        <div
          id='videoo'
          className='h-auto bg-neutral-800 m-1 p-2 rounded-md flex flex-wrap gap-6 justify-evenly'
        >
          {videos.map(({ thumbnail, title, duration, _id }) => (
            <div key={_id} className='flex flex-col' onClick={() => videoPage(_id)}>
              <div className='aspect-[5/3] min-w-[90vw] sm:min-w-[45vw] lg:min-w-[30vw] bg-yellow-200 rounded-md hover:scale-105 transition-transform duration-300' 
              style={ {backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center'} }></div>
                <div className='bg-neutral-800 h-[15%] w-[75vw] sm:w-[300px] p-1 flex flex-row justify-between px-2 rounded-sm'>
                  <h1 className='text-neutral-400 font-bold text-xl overflow-hidden whitespace-nowrap text-ellipsis w-[75%]'>
                    {title}
                  </h1>
                  <h1 className='text-neutral-400 font-bold text-xl'>
                    {Math.round(duration)}
                  </h1>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
 

export default HomePage