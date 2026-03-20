import React, { useEffect } from 'react'
import oopsTubelogo from '../assets/oopsTube_logo.png'
import coverImage from '../assets/DSC03001.JPG'
import { Pencil } from 'lucide-react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useState } from 'react';
import AddVideoPopup from '../Video/AddVideoPopup'
import UpdateAccountPopup from './UpdateAccountPopup'
import axiosInstance from '../utils/AxiosInstance'

const UserProfile = () => {

    const { userData, setUserData } = useContext(AuthContext);
    const [ history, setHistory ] = useState(false)
    const [ showVideos, setShowVideos ] = useState(false)
    const [ video, setVideo ] = useState([])
    const [ addVideoPopup, setAddVideoPopup] = useState(false)
    const [ AccountUpdatePopup, setAccountUpdatePopup] = useState(false)


    const navigate = useNavigate();
    
    const fetchHistory =async () => {
        const hist = await axiosInstance.get('/users/history')
        console.log('histttttttttt',hist.data.data.length)
        if (hist.data.data.length != 0) {
            setHistory(true)
        }
    }

    const fetchVideos = async () => {
        const vid = await axiosInstance.get('/videos/'
        )
        setShowVideos(true)
        console.log(video)
        setVideo(vid)
        console.log(video)
        // if (video.data.data.docs.length != 0) {
        //     console.log('videoooooooooooooos', video.data.data.docs[0].thumbnail)
        //     setShowVideos(true)
        //     video.data.data.docs.forEach(function(val) {
        //         console.log(val.thumbnail)
        //     })
        // }

        
    }
    
    useEffect(() => {
        fetchHistory()
        fetchVideos()

    },[])

    const logout = async () => {
        try {
            const res = await axiosInstance.post('/users/logout', {})
    
            setUserData('')
            navigate('/')
        } catch (error) {
            console.log('nahi hua',error)
        }
    }

    const videoPage = (_id) => {
        navigate(`/video`, {state: {id: _id}})
    }
  
    if (!userData?.data?.user) {
        return (<div>Profile Loading</div>)
    }



    return (
        
        <div id='container' className='bg-neutral-900 h-auto w-full flex flex-col relative'>
            {addVideoPopup && <AddVideoPopup onAddDone={() =>{
                        setAddVideoPopup(false)
                    fetchVideos()}
                    }  
                    onClose={() =>setAddVideoPopup(false)} />}
            {AccountUpdatePopup && <UpdateAccountPopup />}
            <div id='navbar' className='bg-neutral-950 h-[12vh] w-full top-0 fixed flex justify-between px-4 py-2'>
                <img
                    src={oopsTubelogo}
                    className='h-full object-contain'>
                </img>
                <button
                    onClick={logout}
                    type='button'
                    className='h-[90%] w-[25%] sm:w-[10%] h-[70%] bg-indigo-600 mb-2 rounded-md font-bold text-xl text-neutral-100 hover:bg-indigo-700 hover:scale-105 transition-all duration-200 mb-2 mt-2'>
                        Log Out
                </button>
            </div>
            <div id='main'>
                <div id='images' className='h-[25vh] md:h-[35vh] w-full bg-neutral-800 mt-[12vh] flex justify-between items-center gap-6' 
                style={userData?.data?.user?.coverImage
                    ? { backgroundImage: `url(${userData.data.user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { backgroundColor: '#906A4E' }}>
                    <div id='avatar' className='aspect-square h-[80%] rounded-full ml-[5vw]' 
                    style={userData?.data?.user?.avatar
                        ? { backgroundImage: `url(${userData.data.user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: '#906A4E' }}></div>
                    <div className='h-full w-[45px]'>
                        <button
                            type='button'
                            className='h-[20%] w-[40px] h-[40px] flex justify-center items-center mb-2 rounded-md font-bold text-xl text-neutral-100 mb-2 mt-2 hover:scale-105 hover:bg-indigo-700 transition-all duration-200'>
                            <Pencil />
                        </button>
                    </div>
                </div>
                <div id='bio' className='h-[30vh] md:h-[20vh] full p-5 bg-neutral-800 p-5 m-5 mx-5 rounded-md flex-row md:flex gap-4'>
                    <div id='info' className='h-[45%] md:h-full w-full md:w-[80%] bg-neutral-700 rounded-sm px-5 mb-4'>
                        <div id='fullname' className='h-[30%] w-full m-1 flex flex-row gap-4 items-center mt-2 '>
                            <h1 className='mt-3 text-stone-300 font-bold text-xl md:text-3xl mb-2'>{userData.data.user.fullname}</h1>
                            <button
                                type='button'
                                className='h-full mt-3 w-[30px] h-[30px] flex justify-center items-center mb-2 rounded-md font-bold text-base text-neutral-100 mb-2 mt-2 hover:scale-105 hover:bg-indigo-700 transition-all duration-200'>
                                <Pencil />
                            </button>
                        </div>
                        <div className='h-[30%] w-full m-1 flex flex-row items-center'>
                            <h2 className='username text-stone-200 text-md md:text-lg font-bold '>{userData.data.user.username}</h2>
                        </div>
                        <div className='h-[30%] w-full m-1 flex flex-row items-center gap-4'>
                            <h5 className='text-stone-200 font-bold text-sm md:text-md mb-3'>{userData.data.user.email}</h5>
                            <button
                                type='button'
                                className='w-[30px] h-[30px] flex justify-center items-center mb-6 rounded-md font-bold text-base text-neutral-100 mb-2 mt-2 hover:scale-105 hover:bg-indigo-700 transition-all duration-200'>
                                <Pencil />
                            </button>
                        </div>
                    </div>
                    <div id='subscribe' className='h-[45%] flex flex-col items-center justify-center md:h-full w-full md:w-[20%] bg-neutral-700 rounded-lg'>
                        
                        <button
                                type='button'
                                onClick={()=> setAccountUpdatePopup(true)}
                                className='mx-1 h-[42%] w-[95%] flex justify-center items-center rounded-md font-bold text-xl bg-indigo-600 text-neutral-300 mb-2 hover:bg-indigo-800 hover:scale-105 transition-all duration-200'>
                                Update Account
                        </button>
                        <button
                                type='button'
                                className='mx-1 h-[42%] w-[95%] flex justify-center items-center rounded-md font-bold text-xl bg-indigo-600 text-neutral-300 hover:bg-indigo-800 hover:scale-105 transition-all duration-200'>
                                Update Avatar
                        </button>
                    </div> 
                </div>
                <div id='videoo' className='h-[40vh] sm:h-[45vh] bg-neutral-800 m-5 p-3 rounded-md'>
                    <div className='flex justify-between'>
                    <h1 className='text-neutral-400 font-bold text-3xl mb-3'>Your Videos</h1>
                    <button 
                        type='button'
                        onClick={()=> {setAddVideoPopup(true)}}
                        className='h-full flex justify-center items-center mb-2 rounded-md font-bold text-base text-neutral-100 hover:scale-105 hover:bg-indigo-700 transition-all duration-200'>
                            <Plus  size={36} strokeWidth={3}/>
                    </button>
                    </div>
                    
                    {showVideos && <div className='h-[30vh] sm:h-[35vh] rounded-sm overflow-x-auto w-full bg-neutral-700 flex p-5 gap-5 scroll-smooth scrollbar-hide'>
                        {video.data.data.docs.map(({ thumbnail, title, duration, _id }) => (
                            <div key={_id} className='flex flex-col' onClick={() => videoPage(_id)}>
                                <div className='h-[80%] w-[75vw] sm:w-[300px] rounded-md mb-2 hover:scale-105 transition-transform duration-300' 
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
                        {/* <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div> */}
                    </div>}
                    {!showVideos && <div className='h-[30vh] sm:h-[35vh] rounded-sm overflow-x-auto w-full bg-neutral-700 flex p-5 items-center justify-center text-neutral-400 font-bold text-3xl'>no videos yet</div>}

                </div>
                <div id='history' className='h-[40vh] sm:h-[45vh] bg-neutral-800 m-5 p-3 rounded-md'>
                    

                    <h1 className='text-neutral-400 font-bold text-3xl mb-3'>Watch History</h1>
                    {history && <div className='h-[30vh] sm:h-[35vh] rounded-sm overflow-x-auto w-full bg-neutral-700 flex p-5 gap-5 scroll-smooth scrollbar-hide'>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                        <div className='h-full min-w-[75vw] sm:min-w-[300px] bg-yellow-200 rounded-md'></div>
                    </div>}
                    {!history && <div className='h-[30vh] sm:h-[35vh] rounded-sm overflow-x-auto w-full bg-neutral-700 flex p-5 items-center justify-center text-neutral-400 font-bold text-3xl'>no videos watched yet</div>}
                </div>
            </div>
        </div>
    )
}

export default UserProfile