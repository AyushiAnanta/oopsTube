import React, { useEffect, useState, useContext, useRef } from 'react';
import { Pencil, Plus, PlayCircle, Clock, KeyRound, Upload, ThumbsUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AddVideoPopup from '../Video/AddVideoPopup';
import UpdateAccountPopup from './UpdateAccountPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import axiosInstance from '../utils/AxiosInstance';

const UserProfile = () => {
    const { userData } = useContext(AuthContext);
    const [historyList, setHistoryList] = useState([]);
    const [videos, setVideos] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [addVideoPopup, setAddVideoPopup] = useState(false);
    const [accountUpdatePopup, setAccountUpdatePopup] = useState(false);
    const [changePasswordPopup, setChangePasswordPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const hist = await axiosInstance.get('/users/history');
            setHistoryList(hist.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const fetchVideos = async () => {
        try {
            const vid = await axiosInstance.get('/videos/');
            setVideos(vid.data?.data?.docs || []);
        } catch (error) {
            console.error('Failed to fetch videos', error);
        }
    };

    const fetchLikedVideos = async () => {
        try {
            const res = await axiosInstance.get('/likes/videos');
            setLikedVideos(res.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch liked videos', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchHistory(), fetchVideos(), fetchLikedVideos()]);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            await axiosInstance.patch('/users/avatar', formData);
            window.location.reload(); // Quickest way to refresh AuthContext and UI
        } catch (error) {
            console.error('Avatar upload failed', error);
            alert('Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('cover-image', file);
        try {
            await axiosInstance.patch('/users/cover-image', formData);
            window.location.reload(); 
        } catch (error) {
            console.error('Cover image upload failed', error);
            alert('Failed to upload cover image');
        } finally {
            setIsUploading(false);
        }
    };

    if (!userData?.data?.user) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const user = userData.data.user;

    const VideoCard = ({ video }) => (
        <Link 
            to={`/video/${video._id}`} 
            className="group flex flex-col gap-3 cursor-pointer shrink-0 w-[280px] sm:w-[320px]"
        >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-dark-800">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayCircle className="text-white w-12 h-12 opacity-80" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                    {formatDuration(video.duration)}
                </div>
            </div>
            <div className="flex gap-3 px-1">
                <div className="flex flex-col">
                    <h3 className="text-gray-100 font-semibold line-clamp-2 leading-tight group-hover:text-brand-400 transition-colors">
                        {video.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className='w-full max-w-[1600px] mx-auto animate-fade-in'>
            {addVideoPopup && <AddVideoPopup onAddDone={() => { setAddVideoPopup(false); fetchVideos(); }} onClose={() => setAddVideoPopup(false)} />}
            {accountUpdatePopup && <UpdateAccountPopup onClose={() => setAccountUpdatePopup(false)} />}
            {changePasswordPopup && <ChangePasswordPopup onClose={() => setChangePasswordPopup(false)} />}
            
            <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={handleAvatarUpload} />
            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={handleCoverImageUpload} />

            {/* Cover Photo */}
            <div 
                className='h-[20vh] md:h-[30vh] w-full rounded-2xl bg-dark-800 relative mb-16 shadow-lg group'
                style={user.coverImage ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                {/* Cover Image Update Button */}
                <button 
                    onClick={() => coverInputRef.current?.click()}
                    className='absolute top-4 right-4 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10'
                >
                    <Upload size={16} /> Update Cover
                </button>

                {/* Avatar floating over cover */}
                <div className='absolute -bottom-12 left-8 md:left-12 flex items-end gap-6'>
                    <div className='relative group/avatar'>
                        <div 
                            className='w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-900 bg-dark-700 shadow-xl overflow-hidden'
                            style={user.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                        />
                        <button 
                            onClick={() => avatarInputRef.current?.click()}
                            className='absolute bottom-2 right-2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-lg transition-transform hover:scale-110 z-10'
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User Info Section */}
            <div className='flex flex-col md:flex-row gap-6 px-4 md:px-12 mb-12'>
                <div className='flex-1'>
                    <h1 className='text-3xl md:text-4xl font-bold text-white mb-1'>{user.fullname}</h1>
                    <p className='text-gray-400 font-medium text-lg mb-4'>@{user.username}</p>
                    <div className='flex flex-wrap items-center gap-4'>
                        <div className='flex items-center gap-4 text-gray-400 text-sm bg-dark-800/50 w-fit px-4 py-2 rounded-xl border border-dark-700/50'>
                            <span>{user.email}</span>
                            <button onClick={() => setAccountUpdatePopup(true)} className='hover:text-brand-400 transition-colors'><Pencil size={14} /></button>
                        </div>
                        <button 
                            onClick={() => setChangePasswordPopup(true)}
                            className='flex items-center gap-2 text-gray-400 text-sm bg-dark-800/50 hover:bg-dark-700 w-fit px-4 py-2 rounded-xl border border-dark-700/50 transition-colors'
                        >
                            <KeyRound size={14} /> Change Password
                        </button>
                    </div>
                </div>
                
                <div className='flex flex-col sm:flex-row gap-3 md:items-end justify-end'>
                    <button 
                        onClick={() => setAccountUpdatePopup(true)}
                        className='px-6 py-2.5 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl border border-dark-700 transition-all'
                    >
                        Update Account
                    </button>
                    <button 
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploading}
                        className='px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50'
                    >
                        {isUploading ? 'Uploading...' : 'Update Avatar'}
                    </button>
                </div>
            </div>

            {/* Your Videos Section */}
            <div className='mb-12 px-4 md:px-12'>
                <div className='flex items-center justify-between mb-6 border-b border-dark-700 pb-4'>
                    <h2 className='text-2xl font-bold text-white'>Your Videos</h2>
                    <button 
                        onClick={() => setAddVideoPopup(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-brand-400 font-semibold rounded-lg border border-dark-700 transition-all'
                    >
                        <Plus size={18} /> Upload Video
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-[320px] h-[250px] bg-dark-800 rounded-xl animate-pulse-slow shrink-0" />
                        ))}
                    </div>
                ) : videos.length > 0 ? (
                    <div className='flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x'>
                        {videos.map((video) => <div className="snap-start" key={video._id}><VideoCard video={video} /></div>)}
                    </div>
                ) : (
                    <div className='w-full py-16 bg-dark-800/30 rounded-2xl border border-dark-700/50 flex flex-col items-center justify-center text-center'>
                        <PlayCircle size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">No videos yet</h3>
                        <p className="text-gray-500 max-w-md">You haven't uploaded any videos to your channel yet. Click the upload button to get started.</p>
                    </div>
                )}
            </div>

            {/* Watch History Section */}
            <div className='px-4 md:px-12 mb-12'>
                <div className='flex items-center gap-3 mb-6 border-b border-dark-700 pb-4'>
                    <Clock className="text-brand-400" size={24} />
                    <h2 className='text-2xl font-bold text-white'>Watch History</h2>
                </div>

                {isLoading ? (
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-[320px] h-[250px] bg-dark-800 rounded-xl animate-pulse-slow shrink-0" />
                        ))}
                    </div>
                ) : historyList.length > 0 ? (
                    <div className='flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x'>
                        {historyList.map((video) => <div className="snap-start" key={video._id}><VideoCard video={video} /></div>)}
                    </div>
                ) : (
                    <div className='w-full py-16 bg-dark-800/30 rounded-2xl border border-dark-700/50 flex flex-col items-center justify-center text-center'>
                        <Clock size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">History is empty</h3>
                        <p className="text-gray-500 max-w-md">Videos you watch will show up here so you can easily find them later.</p>
                    </div>
                )}
            </div>

            {/* Liked Videos Section */}
            <div className='px-4 md:px-12 mb-12'>
                <div className='flex items-center gap-3 mb-6 border-b border-dark-700 pb-4'>
                    <ThumbsUp className="text-brand-400 fill-brand-400" size={24} />
                    <h2 className='text-2xl font-bold text-white'>Liked Videos</h2>
                </div>

                {isLoading ? (
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-[320px] h-[250px] bg-dark-800 rounded-xl animate-pulse-slow shrink-0" />
                        ))}
                    </div>
                ) : likedVideos.length > 0 ? (
                    <div className='flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x'>
                        {likedVideos.map((video) => <div className="snap-start" key={video._id}><VideoCard video={video} /></div>)}
                    </div>
                ) : (
                    <div className='w-full py-16 bg-dark-800/30 rounded-2xl border border-dark-700/50 flex flex-col items-center justify-center text-center'>
                        <ThumbsUp size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">No liked videos</h3>
                        <p className="text-gray-500 max-w-md">Videos you like will show up here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;