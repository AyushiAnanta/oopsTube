import React, { useEffect, useState, useContext } from 'react';
import { Pencil, Calendar, Clock, Trash2, CircleUserRound, ToggleRight, ToggleLeft, Send, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import UpdateVideoPopup from './UpdateViedeoPopup';
import CommentPopup from '../Comments/CommentPopup';
import axiosInstance from '../utils/AxiosInstance';

const VideoPage = () => {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const { userData } = useContext(AuthContext);

    const [vid, setVid] = useState(null);
    const [user, setUser] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showEditCommentPopup, setShowEditCommentPopup] = useState(false);
    const [EditComment, setEditComment] = useState('');
    const [EditCommentId, setEditCommentId] = useState('');
    const [showEditVideoPopup, setShowEditVideoPopup] = useState(false);
    const [toggleMode, setToggleMode] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Assuming the logged in user is the owner if their ID matches the video owner
    const isOwner = (userData?.user?._id || userData?.data?.user?._id) === vid?.owner;

    const fetchVideo = async () => {
        try {
            const res = await axiosInstance.get(`/videos/${videoId}`);
            const videoData = res?.data?.data;
            setVid(videoData);
            setToggleMode(videoData?.isPublished);
            const url = videoData?.videoFile?.replace('/upload/', '/upload/f_mp4/');
            setVideoUrl(url);

            if (videoData?.owner) {
                const ownerRes = await axiosInstance.get(`/users/c/${videoData.owner}`);
                setUser(ownerRes?.data?.data);
            }
        } catch (error) {
            console.error('Failed to fetch video', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/comments/${videoId}`);
            setComments(res?.data?.data?.docs || []);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchVideo();
        fetchComments();
    }, [videoId]);

    const deleteVideo = async () => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        await axiosInstance.delete(`/videos/${videoId}`);
        navigate('/profile');
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        try {
            await axiosInstance.post(`/comments/${videoId}`, { content: newComment });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const deleteComment = async (_id) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await axiosInstance.delete(`/comments/c/${_id}`);
            fetchComments();
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const togglePublish = async () => {
        try {
            const res = await axiosInstance.patch(`/videos/toggle/publish/${vid?._id}`);
            setToggleMode(res?.data?.data?.isPublished);
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    return (
        <div className='w-full flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto'>
            {showEditVideoPopup && <UpdateVideoPopup 
                onClose={() => setShowEditVideoPopup(false)}
                onUpdateDone={() => {
                    setShowEditVideoPopup(false);
                    fetchVideo();
                }}
                oldtitle={vid?.title}
                olddescription={vid?.description}
                oldthumbnail={vid?.thumbnail}
                id={vid?._id}/>}

            {/* LEFT COLUMN: Video Player & Details */}
            <div className='flex-1 w-full lg:w-[65%] xl:w-[70%]'>
                {/* Video Player */}
                <div className='w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-dark-700 mb-6'>
                    {isLoading ? (
                        <div className="w-full h-full animate-pulse-slow bg-dark-800"></div>
                    ) : videoUrl ? (
                        <video src={videoUrl} controls autoPlay className='w-full h-full object-contain outline-none'></video>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">Video unavailable</div>
                    )}
                </div>

                {/* Video Meta Info */}
                {isLoading ? (
                    <div className="animate-pulse-slow space-y-4">
                        <div className="h-8 bg-dark-800 rounded-md w-3/4"></div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 bg-dark-800 rounded-full"></div>
                            <div className="h-10 bg-dark-800 rounded-md w-1/4"></div>
                        </div>
                    </div>
                ) : (
                    <div className='bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/50'>
                        <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>{vid?.title}</h1>
                        
                        <div className='flex items-center justify-between flex-wrap gap-4 border-b border-dark-700 pb-4 mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xl'>
                                    {user?.username?.charAt(0).toUpperCase() || <CircleUserRound />}
                                </div>
                                <div>
                                    <h3 className='font-bold text-lg text-white'>{user?.username || 'Unknown User'}</h3>
                                    <p className='text-sm text-gray-400'>{user?.subscribersCount || 0} subscribers</p>
                                </div>
                                
                                {!isOwner && user && (
                                    <button 
                                        onClick={async () => {
                                            try {
                                                const res = await axiosInstance.post(`/subscriptions/c/${user._id}`);
                                                setUser(prev => ({
                                                    ...prev,
                                                    isSubscribed: res.data.data.subscribed,
                                                    subscribersCount: res.data.data.subscribed 
                                                        ? prev.subscribersCount + 1 
                                                        : prev.subscribersCount - 1
                                                }));
                                            } catch (error) {
                                                console.error('Failed to toggle subscription', error);
                                            }
                                        }}
                                        className={`ml-4 px-4 py-1.5 rounded-full font-medium transition-colors ${
                                            user.isSubscribed 
                                                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600' 
                                                : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    >
                                        {user.isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                )}
                            </div>

                            {/* Owner Controls and Like Button */}
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={async (e) => {
                                        if(!userData) return;
                                        try {
                                            const res = await axiosInstance.post(`/likes/toggle/v/${vid._id}`);
                                            const isNowLiked = res.data.data.liked;
                                            
                                            // Trigger confetti if liked
                                            if (isNowLiked) {
                                                const rect = e.target.getBoundingClientRect();
                                                const x = (rect.left + rect.width / 2) / window.innerWidth;
                                                const y = (rect.top + rect.height / 2) / window.innerHeight;
                                                confetti({
                                                    particleCount: 80,
                                                    spread: 60,
                                                    origin: { x, y },
                                                    colors: ['#ec4899', '#a78bfa', '#fbcfe8']
                                                });
                                            }

                                            setVid(prev => ({
                                                ...prev,
                                                isLiked: isNowLiked,
                                                likesCount: isNowLiked ? prev.likesCount + 1 : prev.likesCount - 1
                                            }));
                                        } catch (error) {
                                            console.error('Failed to toggle like', error);
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors border btn-squish ${
                                        vid?.isLiked 
                                            ? 'bg-brand-600/20 text-brand-400 border-brand-500/50 hover:bg-brand-600/30' 
                                            : 'bg-dark-800 text-gray-300 border-dark-700 hover:bg-dark-700'
                                    }`}
                                >
                                    <ThumbsUp size={18} className={vid?.isLiked ? 'fill-current' : ''} />
                                    <span>{vid?.likesCount || 0}</span>
                                </button>

                                {isOwner && (
                                    <div className='flex items-center gap-2 bg-dark-900 px-4 py-2 rounded-full border border-dark-700'>
                                        <button onClick={togglePublish} className='flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors' title="Toggle Publish">
                                            {toggleMode ? <ToggleRight /> : <ToggleLeft />}
                                            <span className="text-sm font-medium">{toggleMode ? 'Published' : 'Private'}</span>
                                        </button>
                                        <div className="w-px h-6 bg-dark-700 mx-2"></div>
                                        <button onClick={() => setShowEditVideoPopup(true)} className='p-2 text-gray-400 hover:text-white transition-colors' title="Edit Video">
                                            <Pencil size={18}/>
                                        </button>
                                        <button onClick={deleteVideo} className='p-2 text-red-400 hover:text-red-300 transition-colors' title="Delete Video">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Box */}
                        <div className='bg-dark-900/50 rounded-xl p-4'>
                            <div className='flex items-center gap-4 text-sm text-gray-400 mb-3 font-medium'>
                                <span className="flex items-center gap-1.5"><Clock size={16} /> {Math.round(vid?.duration || 0)}s</span>
                                <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(vid?.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className='text-gray-200 whitespace-pre-wrap leading-relaxed'>
                                {vid?.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
                
            {/* RIGHT COLUMN: Comments */}
            <div className='flex-1 w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-4'>
                <div className='bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/50 min-h-[500px] flex flex-col'>
                    <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
                        Comments <span className="text-sm font-medium text-gray-400 px-2 py-0.5 bg-dark-700 rounded-full">{comments.length}</span>
                    </h2>
                    
                    {/* Add Comment */}
                    <div className='flex gap-3 mb-8'>
                        <div className="w-10 h-10 bg-dark-700 rounded-full shrink-0 flex items-center justify-center text-gray-400">
                            <CircleUserRound size={20} />
                        </div>
                        <div className="flex-1 flex flex-col items-end gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full bg-transparent border-b border-dark-600 pb-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                            />
                            {newComment && (
                                <button
                                    onClick={addComment}
                                    className='px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-full flex items-center gap-2 transition-colors'
                                >
                                    <Send size={14} /> Comment
                                </button>
                            )}
                        </div>
                    </div>

                    {showEditCommentPopup && <CommentPopup 
                        onEditDone={() => {
                            setShowEditCommentPopup(false);
                            fetchComments();
                        }}  
                        onClose={() => setShowEditCommentPopup(false)} 
                        EditComment={EditComment} 
                        EditCommentId={EditCommentId}
                    />}
                   
                    {/* Comments List */}
                    <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="flex gap-3 animate-pulse-slow">
                                    <div className="w-10 h-10 rounded-full bg-dark-700 shrink-0"></div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="h-3 bg-dark-700 rounded-md w-1/3"></div>
                                        <div className="h-4 bg-dark-700 rounded-md w-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : comments.length > 0 ? (
                            comments.map((commentData) => {
                                const { content, _id, owner, createdAt } = commentData;
                                const isCommentOwner = (userData?.user?._id || userData?.data?.user?._id) === owner;
                                return (
                                    <div key={_id} className='group flex gap-3 items-start'>
                                        <div className="w-10 h-10 bg-dark-700 rounded-full shrink-0 flex items-center justify-center text-gray-400">
                                            <CircleUserRound size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-gray-300">User</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className='text-gray-100 text-sm leading-relaxed'>{content}</p>
                                        </div>
                                        
                                        {isCommentOwner && (
                                            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
                                                <button
                                                    onClick={() => {
                                                        setShowEditCommentPopup(true);
                                                        setEditComment(content);
                                                        setEditCommentId(_id);
                                                    }}
                                                    className='p-1.5 text-gray-400 hover:text-brand-400 hover:bg-dark-700 rounded-md transition-colors'
                                                    title="Edit"
                                                >
                                                    <Pencil size={14}/>
                                                </button>
                                                <button
                                                    onClick={() => deleteComment(_id)}
                                                    className='p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded-md transition-colors'
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 mt-10">No comments yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;