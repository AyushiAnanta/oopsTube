import React, { useEffect } from 'react'
import oopsTubelogo from '../assets/oopsTube_logo.png'
import { Pencil, Calendar, Clock, Trash2, CircleUserRound, User, ToggleRight, ToggleLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UpdateVideoPopup from './UpdateViedeoPopup';
import CommentPopup from '../Comments/CommentPopup';
import axiosInstance from '../utils/AxiosInstance';

const VideoPage = () => {

    const navigate = useNavigate();
    const { setUserData } = useContext(AuthContext);
    const logout = async () => {
        try {
            const res = await axiosInstance.post('/users/logout', {})
    
            setUserData('')
            navigate('/')
        } catch (error) {
            console.log('nahi hua logout',error)
        }
    }

    const [ vid , setVid] = useState('')
    const [ user , setUser] = useState('')
    const [ videoUrl, setVideoUrl] = useState('')
    const [ comments, setComments] = useState('')
    const [ newComment, setNewComment ] = useState('')
    const [ log, setLog ] = useState('')
    const [ showEditCommentPopup, setShowEditCommentPopup ] = useState(false);
    const [ EditComment, setEditComment ] = useState('');
    const [ EditCommentId, setEditCommentId ] = useState('');
    const [ owner, setOwner ] = useState(true);
    const [ showEditVideoPopup, setShowEditVideoPopup ] = useState(false)
    const [ toggleMode, setToggleMode ] = useState(true)

    const location = useLocation();


    const fetchVideo = async () => {
        try {
            const res = await axiosInstance.get(`/videos/${location.state.id}`)
            setVid(res)
            const url = res?.data?.data?.videoFile?.replace('/upload/', '/upload/f_mp4/')
            setVideoUrl(url)

        

        } catch (error) {
            console.log('nahiiiii aya video', error)
        }
    } 

    const deleteVideo = async () => {
        const res = await axiosInstance.delete(`/videos/${location.state.id}`)
        navigate('/profile')
    }

    const callOwner = async () => {
        if (vid?.data?.data?.owner) {
        const owner=vid?.data?.data?.owner
        console.log('wwwwwwwwww',owner)
        const res = await axiosInstance.get(`/users/c/${owner}`)
        console.log(res)
        setUser(res)}
    }

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/comments/${location.state.id}`)
            setComments(res)
        } catch (error) {
            console.log('nahiiiii aye comments', error)
        }
    }

    useEffect(() => {
      fetchVideo(),
      fetchComments()
    }, [location.state.id])

    useEffect(() => {
        if (vid?.data?.data?.owner) {
            callOwner();
        }
        }, [vid]);

    
    const addComment = async () => {
        try {
            const res = await axiosInstance.post(`/comments/${location.state.id}`, {content: newComment})
            setNewComment('')
            fetchComments()
        } catch (error) {
            console.log('not added commentts', error)
        }
    }
    
    const deleteComment = async (_id, content) => {
        try {
            const res = await axiosInstance.delete(`/comments/c/${_id}`)
            fetchComments()
            setLog(res)
        } catch (error) {
            console.log('comment not deleted',log, error)
        }
    }

    const isOwner = async () => {
        // match current user with video or comment original owner
        // setOwner(true/false)
    }

    const toggle = async () => {
        // setToggleMode(!toggleMode)
        const res = await axiosInstance.patch(`/videos/toggle/publish/${vid?.data?.data?._id}`)
        console.log(res)
        setToggleMode(res?.data?.data?.isPublished)
        console.log(toggleMode)
    }

    return (
    <div id='container' className='bg-neutral-900 h-auto w-full flex flex-col relative'>
        {showEditVideoPopup && <UpdateVideoPopup 
            onClose={() => setShowEditVideoPopup(false)}
            onUpdateDone={() => {setShowEditVideoPopup(false)
                fetchVideo
            }}
            oldtitle={vid?.data?.data?.title}
            olddescription={vid?.data?.data?.description}
            oldthumbnail={vid?.data?.data?.thumbnail}
            id={vid?.data?.data?._id}/>}
        <div id='navbar' className='bg-neutral-950 h-[12vh] w-full top-0 fixed flex justify-between px-4 py-2'>
            <img
                src={oopsTubelogo}
                className='h-full object-contain'>
            </img>
            <button
                type='button'
                onClick={logout}
                className='h-[90%] w-[25%] sm:w-[10%] h-[70%] bg-violet-600 mb-2 rounded-md font-bold text-xl text-neutral-100 hover:bg-violet-700 hover:scale-105 transition-all duration-200 mb-2 mt-2'>
                    Log Out
            </button>
        </div>
        <div id='main' className='w-full h-auto flex flex-wrap justify-evenly'>
            <div id='video' className='p-3 rounded-md w-[97%] h-full lg:h-[80vh] lg:w-[54%] bg-neutral-800 mt-[14vh]'>
                {videoUrl? (<video src = {videoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    className='w-full h-full object-cover'>a</video>) : (<h1>loading...</h1>)}
            </div>
            <div id='description' className='p-2 rounded-md h-auto w-[97%] lg:h-[80vh] lg:w-[35%] lg:mt-[14vh] mt-8 bg-neutral-800'>
                <h1 className='text-neutral-200 font-bold text-2xl md:text-3xl mb-4 bg-neutral-700 p-2 rounded-md'>{vid?.data?.data?.title}</h1>
                <div className='bg-neutral-700 mt-5 w-full rounded-md h-[76%] p-3 text-neutral-300 flex flex-col'>
                <h2 className='font-semibold text-xl mb-3'>{vid?.data?.data?.description}</h2>
                <h3 className='text-md mb-3 flex gap-4'><Clock /> {vid?.data?.data?.duration}</h3>
                <h3 className='text-md mb-3 flex gap-4'><Calendar /> {vid?.data?.data?.createdAt}</h3>
                <div className='bg-neutral-700 mt-2 w-full rounded-md h-[10%] p-3 text-neutral-300 mb-4 mt-auto flex justify-between'>
                    <h3 className='text-lg font-semibold mb-5 flex gap-4 '><CircleUserRound /> {user?.data?.data?.username}</h3>
                    {owner && 
                <div>
                    <button
                        type='button'
                        onClick={toggle}
                        className='rounded-md h-8 w-8 p-1 text-violet-400 hover:bg-neutral-950 hover:scale-105 transition-all duration-200'>{toggleMode && <ToggleRight />}{!toggleMode && <ToggleLeft />}
                    </button>
                    <button
                        type='button'
                        onClick={() => setShowEditVideoPopup(true)}
                        className='rounded-md h-8 w-8 p-1 text-violet-400 hover:bg-neutral-950 hover:scale-105 transition-all duration-200'><Pencil strokeWidth={0.75}/>
                    </button>
                    <button
                        type='button'
                        onClick={deleteVideo}
                        className='rounded-md h-8 w-8 p-1 text-neutral-100 hover:bg-violet-400 hover:scale-105 transition-all duration-200'><Trash2 strokeWidth={0.75} />
                    </button>
                </div>}
            </div>
            </div>
            </div>
                
                
            <div id='comments' className='p-5 rounded-md h-auto w-[97%] mt-8 bg-neutral-800'>
                    <h1 className='text-neutral-200 font-bold text-2xl md:text-3xl mb-4 bg-neutral-700 p-2 rounded-md'>Comments</h1>
                    <div>
                        <h1 className='text-neutral-200 font-bold text-xl md:text-2xl mb-1 p-2 rounded-md'>Add Comment</h1>
                        <div className='flex justify-between text-neutral-200 w-full gap-2'>
                        <input
                            type="text"
                            placeholder="Enter comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-4/5 h-12 p-2 mb-3 rounded bg-zinc-800 text-white placeholder:text-[#EAE5D6] border border-dashed border-violet-400"
                        />
                        <button
                            type='button'
                            onClick={addComment}
                            className='h-12 w-[20%] bg-violet-600 rounded-md sm:font-bold text-sm sm:text-xl text-neutral-100 hover:bg-violet-700 hover:scale-105 transition-all duration-200'>
                                Submit
                        </button>
                        </div>
                    </div>
                    {showEditCommentPopup && <CommentPopup 
                    onEditDone={() =>{
                        setShowEditCommentPopup(false) 
                        fetchComments()}
                    }  
                    onClose={() =>setShowEditCommentPopup(false)} 
                    EditComment={EditComment} 
                    EditCommentId={EditCommentId}/>}
                   
                    {comments?.data?.data?.docs?.map(({content, _id}) => (
                        <div key={_id} className='flex justify-between'>
                            <div className='text-violet-400 font-semibold text-lg m-2 flex gap-4'>
                                <div><User /></div>
                                <h1 className='text-neutral-100'>{content}</h1></div>
                            {owner && <div className='m-4 flex gap-4'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setShowEditCommentPopup(true);
                                        setEditComment(content)
                                        setEditCommentId(_id)
                                        console.log('edit itttt', _id, content);
                                    }}
                                    className='rounded-md h-8 w-8 p-1 text-violet-400 hover:bg-neutral-950 hover:scale-105 transition-all duration-200'><Pencil strokeWidth={0.75}/>
                                </button>
                                <button
                                    type='button'
                                    onClick={() => {deleteComment(_id, content)}}
                                    className='rounded-md h-8 w-8 p-1 text-neutral-100 hover:bg-violet-400 hover:scale-105 transition-all duration-200'><Trash2 strokeWidth={0.75} />
                                </button>
                            </div>}
                        </div>
                    ))}
            </div>

        </div>
    </div>
  )
}

export default VideoPage