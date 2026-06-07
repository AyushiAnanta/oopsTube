import React from 'react';

const SurprisePage = () => {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-8 font-sans">Gotcha! You just got rickrolled!</h1>
            <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-4 ring-brand-500">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default SurprisePage;
