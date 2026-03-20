import React, { useEffect } from 'react'
import oopsTubelogo from '../assets/oopsTube_logo.png'
import coverImage from '../assets/DSC03001.JPG'
import { Pencil, Calendar, Clock, Trash2, CircleUserRound, User, ToggleRight, ToggleLeft } from 'lucide-react'
import { useState } from 'react';
import Modal from '../Modal';
import axiosInstance from '../utils/AxiosInstance';


const Comments = ({id}) => {

    const [ comment, setComment] = useState('')
    const [ newComment, setNewComment ] = useState('')
    const [ log, setLog ] = useState('')
    const [ showEditCommentPopup, setShowEditCommentPopup ] = useState(false);
    const [ EditComment, setEditComment ] = useState('');
    const [ EditCommentId, setEditCommentId ] = useState('');

    
    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/comments/${id}`)
            setComment(res)
        } catch (error) {
            console.log('nahiiiii aye comments', error)
        }
    }

    const addComment = async () => {
        try {
            const res = await axiosInstance.post(`/comments/${id}`, {content: newComment})
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



    return (
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
                    {showEditCommentPopup && <Modal 
                    onEditDone={() =>{
                        setShowEditCommentPopup(false) 
                        fetchComments()}
                    }  
                    onClose={() =>setShowEditCommentPopup(false)} 
                    EditComment={EditComment} 
                    EditCommentId={EditCommentId}/>}
                   
                    {comment?.data?.data?.docs?.map(({content, _id}) => (
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
  )
}

export default Comments