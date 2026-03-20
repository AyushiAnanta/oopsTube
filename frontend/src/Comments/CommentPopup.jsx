import React, { useState } from 'react'
import {X} from 'lucide-react'
import axiosInstance from '../utils/AxiosInstance'

const CommentPopup = ({EditComment, EditCommentId, onClose, onEditDone}) => {
  console.log(EditComment,EditCommentId)
  const [editedComment, setEditedComment] = useState(EditComment)

  const OnSubmit = async () => {
    try {
      console.log({EditComment,EditCommentId})
      const res = await axiosInstance.patch(`/comments/c/${EditCommentId}`,
        {content:editedComment})
      console.log(res)
      onEditDone()
    } catch (error) {
      console.log('couldnt edit comment',error)
    }
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm text-white font-bold text-3xl h-screen w-screen flex justify-center items-center'>
        <div className='h-[50vh] w-[40vw] bg-neutral-800 p-5 flex items-center flex-col'>
            <button 
              type='button'
              onClick={onClose}
              className='right-0 font-bold flex justify-end items-start w-full'><X /></button>
            <h1 className='font-bold flex justify-center text-neutral-100 text-3xl mb-[10%]'>Edit Comment</h1>
            <input
              type="text"
              placeholder="Enter comment here..."
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-[70%] h-18 p-2 mb-20 rounded bg-zinc-800 text-white font-semibold text-lg placeholder:text-[#EAE5D6] border border-dashed border-violet-400"
            />
            <button 
              type='button'
              onClick={OnSubmit}
              className='h-12 w-[50%] sm:w-[40%] bg-violet-600 rounded-md font-bold text-md sm:text-xl text-neutral-100 hover:bg-violet-700 hover:scale-105 transition-all duration-200'>
                Submit
            </button>

        </div>

        </div>
  )
}

export default CommentPopup