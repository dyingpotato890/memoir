import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Eye } from "lucide-react";

import { fetchEvents, incrementClickCount } from '../../components/supabase';
import StarfieldBackground from '../../components/background';

interface Link {
    id: number;
    title: string;
    url: string;
    click_count: number;
    event_name: string;
}

interface GroupedEvent {
    eventName: string;
    links: Link[];
}

const handleLinkClick = async (linkId: number, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    incrementClickCount(linkId);
};

const loadFonts = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=BBH+Bartle&family=Cal+Sans&family=Poppins:wght@400;500;600&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link);
    }
};

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);

    useEffect(() => {
        const init = async () => {
            loadFonts();
            const data = await fetchEvents();
            setGroupedEvents(data);
            setIsLoading(false);
        };

        init();

        console.log(groupedEvents);
    }, []);

    if (isLoading) {
        return (
            <>
                <StarfieldBackground />
                <div className="min-h-screen flex items-center justify-center relative z-10">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                        <p className="text-lg text-gray-200 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Loading photo albums...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <StarfieldBackground /> 

            <div className="min-h-screen relative z-10">
                {/* Header */}
                <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                    <div className="text-center mb-12">
                        <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-5xl md:text-6xl mb-3 font-bold' style={{ fontFamily: "'BBH Bartle', sans-serif" }}>
                            memoir
                        </h1>
                        <h2 className='text-gray-300 text-lg md:text-xl' style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Trip down memory lane! ✨
                        </h2>
                    </div>

                    {/* Events */}
                    <div className="space-y-10">
                        {groupedEvents.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-700 p-12 max-w-md mx-auto">
                                    <p className="text-gray-400 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        No albums available yet
                                    </p>
                                </div>
                            </div>
                        ) : (
                            groupedEvents.map((event, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        {/* Event name */}
                                        <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
                                        <h2 
                                            className="text-3xl md:text-4xl font-bold text-white"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {event.eventName}
                                        </h2>
                                        <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                                    </div>

                                    {/* Links list for this event */}
                                    <div className="space-y-3">
                                        {event.links.map((link) => (
                                            <button
                                                key={link.id}
                                                onClick={() => handleLinkClick(link.id, link.url)}
                                                className="w-full bg-gray-900/60 backdrop-blur-md hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-blue-900/40 border border-gray-700 hover:border-cyan-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-0.5 group"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        {/* Icon container */}
                                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                                                            <ExternalLink className="w-6 h-6 text-white" strokeWidth={2.5} />
                                                        </div>

                                                        {/* Link title text */}
                                                        <span 
                                                            className="text-lg md:text-xl font-semibold text-gray-100 text-left truncate"
                                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                                        >
                                                            {link.title}
                                                        </span>
                                                    </div>

                                                    {/* Right: click count pill */}
                                                    <div className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-cyan-400/30">
                                                        <Eye className="w-4 h-4 text-cyan-400" strokeWidth={2.5} />
                                                        <span 
                                                            className="text-sm font-bold text-cyan-300 tabular-nums"
                                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                                        >
                                                            {link.click_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-20 text-center">
                        <div className="inline-block bg-gray-900/60 backdrop-blur-sm px-8 py-3 rounded-full shadow-lg border border-gray-700">
                            <p 
                                className="text-sm text-gray-400 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Made with ❤️ for memories
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;