import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../utils/AxiosInstance';
import { AuthContext } from '../AuthContext';
import { MessageSquarePlus, Trash2, Pencil, CircleUserRound, Send } from 'lucide-react';

const CommunityPage = () => {
    const { userData } = useContext(AuthContext);
    const [tweets, setTweets] = useState([]);
    const [newTweet, setNewTweet] = useState('');
    const [editingTweet, setEditingTweet] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const user = userData?.user || userData?.data?.user;

    const fetchTweets = async () => {
        try {
            setIsLoading(true);
            // The backend endpoint getUserTweets ignores userId and uses req.user._id
            const res = await axiosInstance.get(`/tweets/user/me`);
            setTweets(res.data?.data || []);
        } catch (error) {
            console.error('Failed to fetch tweets', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, []);

    const handleCreateTweet = async (e) => {
        e.preventDefault();
        if (!newTweet.trim()) return;
        try {
            await axiosInstance.post('/tweets/', { content: newTweet });
            setNewTweet('');
            fetchTweets();
        } catch (error) {
            console.error('Failed to create tweet', error);
        }
    };

    const handleDeleteTweet = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this tweet?")) return;
        try {
            await axiosInstance.delete(`/tweets/${tweetId}`);
            fetchTweets();
        } catch (error) {
            console.error('Failed to delete tweet', error);
        }
    };

    const handleUpdateTweet = async (tweetId) => {
        if (!editContent.trim()) return;
        try {
            await axiosInstance.patch(`/tweets/${tweetId}`, { content: editContent });
            setEditingTweet(null);
            setEditContent('');
            fetchTweets();
        } catch (error) {
            console.error('Failed to update tweet', error);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">Community</h1>

            {/* Create Tweet Form */}
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/50 mb-8 shadow-lg">
                <form onSubmit={handleCreateTweet} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-dark-700 border-2 border-dark-600 flex items-center justify-center">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <CircleUserRound className="text-gray-400" size={24} />
                        )}
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <textarea
                            value={newTweet}
                            onChange={(e) => setNewTweet(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent border-b border-dark-600 pb-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none overflow-hidden"
                            rows="2"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!newTweet.trim()}
                                className="px-6 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-dark-700 disabled:text-gray-500 text-white font-medium rounded-full flex items-center gap-2 transition-all"
                            >
                                <Send size={16} /> Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Tweets Feed */}
            <div className="flex flex-col gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-dark-800/30 rounded-2xl p-6 border border-dark-700/30 animate-pulse-slow">
                            <div className="flex gap-4 mb-4">
                                <div className="w-12 h-12 bg-dark-700 rounded-full"></div>
                                <div className="flex flex-col justify-center gap-2 w-1/3">
                                    <div className="h-4 bg-dark-700 rounded w-full"></div>
                                    <div className="h-3 bg-dark-700 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-16 bg-dark-700 rounded w-full"></div>
                        </div>
                    ))
                ) : tweets.length > 0 ? (
                    tweets.map((tweet) => (
                        <div key={tweet._id} className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-dark-700/50 hover:border-dark-600 transition-colors group shadow-sm hover:shadow-md">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-dark-700 border border-dark-600 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <CircleUserRound className="text-gray-400" size={24} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{user?.fullname || 'You'}</span>
                                            <span className="text-sm text-gray-500">@{user?.username || 'user'}</span>
                                            <span className="text-xs text-gray-600">• {new Date(tweet.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => {
                                                    setEditingTweet(tweet._id);
                                                    setEditContent(tweet.content);
                                                }}
                                                className="p-2 text-gray-400 hover:text-brand-400 hover:bg-dark-700 rounded-full transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTweet(tweet._id)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded-full transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    {editingTweet === tweet._id ? (
                                        <div className="mt-3 flex flex-col gap-3">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                                                rows="3"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setEditingTweet(null)}
                                                    className="px-4 py-1.5 rounded-lg border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors font-medium text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateTweet(tweet._id)}
                                                    className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors font-medium text-sm"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-20 bg-dark-800/30 rounded-2xl border border-dark-700/50 flex flex-col items-center justify-center text-center">
                        <MessageSquarePlus size={48} className="text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">It's quiet here...</h3>
                        <p className="text-gray-500 max-w-sm">Share your thoughts with the community. Be the first to start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
