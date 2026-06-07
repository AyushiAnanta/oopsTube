import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';
import { PlayCircle } from 'lucide-react';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/videos/video?page=${pageNum}&limit=12`);
      const fetchedVideos = res.data?.data?.docs || [];
      const totalPages = res.data?.data?.totalPages || 1;
      
      if (pageNum === 1) {
          setVideos(fetchedVideos);
      } else {
          setVideos(prev => [...prev, ...fetchedVideos]);
      }
      
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Failed to fetch videos', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
            if (!isLoading && hasMore) {
                setPage(p => {
                    const next = p + 1;
                    fetchVideos(next);
                    return next;
                });
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore, fetchVideos]);

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-white">Recommended Videos</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {videos.map((video) => (
            <Link 
              to={`/video/${video._id}`} 
              key={video._id}
              className="group flex flex-col gap-3 cursor-pointer"
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
                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
          {isLoading && Array.from({ length: 8 }).map((_, idx) => (
            <div key={`loading-${idx}`} className="flex flex-col gap-3 animate-pulse-slow">
              <div className="w-full aspect-video bg-dark-800 rounded-xl"></div>
              <div className="flex gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-dark-800 shrink-0"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 bg-dark-800 rounded-md w-3/4"></div>
                  <div className="h-3 bg-dark-800 rounded-md w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
      
      {!hasMore && videos.length > 0 && (
          <div className="text-center py-8 text-gray-500 font-medium">
              You've reached the end of the feed.
          </div>
      )}
    </div>
  );
};

export default HomePage;