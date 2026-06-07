import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import { PlayCircle, Users, Video } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const SubscriptionsPage = () => {
    const { userData } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!userData?.data?.user) return;
            try {
                setIsLoading(true);
                const res = await axiosInstance.get(`/subscriptions/u/me`);
                setSubscriptions(res.data?.data || []);
            } catch (error) {
                console.error('Failed to fetch subscriptions', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptions();
    }, [userData]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!userData?.data?.user) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Users className="text-brand-400" size={32} /> Subscriptions
            </h1>

            {isLoading ? (
                <div className="flex flex-col gap-12">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse-slow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-dark-800"></div>
                                <div className="h-6 w-48 bg-dark-800 rounded"></div>
                            </div>
                            <div className="flex gap-6 overflow-hidden">
                                {[1, 2, 3].map(j => (
                                    <div key={j} className="w-[320px] h-[200px] bg-dark-800 rounded-xl shrink-0"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : subscriptions.length > 0 ? (
                <div className="flex flex-col gap-12">
                    {subscriptions.map((sub) => (
                        <div key={sub._id} className="border-b border-dark-700/50 pb-12 last:border-0">
                            {/* Channel Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-700 border-2 border-dark-600">
                                    {sub.channel.avatar ? (
                                        <img src={sub.channel.avatar} alt={sub.channel.fullname} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                                            {sub.channel.fullname.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{sub.channel.fullname}</h2>
                                    <p className="text-gray-400">@{sub.channel.username}</p>
                                </div>
                            </div>

                            {/* Channel's Latest Videos */}
                            {sub.latestVideos && sub.latestVideos.length > 0 ? (
                                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                    {sub.latestVideos.map((video) => (
                                        <Link 
                                            to={`/video/${video._id}`} 
                                            key={video._id}
                                            className="group flex flex-col gap-3 cursor-pointer shrink-0 w-[280px] sm:w-[320px] snap-start"
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
                                            <div className="flex flex-col px-1">
                                                <h3 className="text-gray-100 font-semibold line-clamp-2 leading-tight group-hover:text-brand-400 transition-colors">
                                                    {video.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 bg-dark-800/20 rounded-xl flex items-center justify-center gap-3 text-gray-500 border border-dark-700/30">
                                    <Video size={24} /> No videos from this channel yet.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full py-20 bg-dark-800/30 rounded-2xl border border-dark-700/50 flex flex-col items-center justify-center text-center">
                    <Users size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Subscriptions</h3>
                    <p className="text-gray-500 max-w-md">You aren't subscribed to any channels yet. Discover creators and subscribe to see their latest videos here.</p>
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;
