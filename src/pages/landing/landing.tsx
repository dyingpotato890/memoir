import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Eye } from "lucide-react";

import { fetchEvents, incrementClickCount } from '../../components/supabase';

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
  await incrementClickCount(linkId);
  window.open(url, '_blank', 'noopener,noreferrer');
};

const loadFonts = () => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=BBH+Bartle&family=Cal+Sans&family=Poppins:wght@400;500;600&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap';
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            <p className="text-lg text-gray-700 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Loading photo albums...
            </p>
            </div>
        </div>
        );
    }
    
    return (
        /* Container */
        <div className="min-h-screen py-6 px-4 block">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center">
                {/* Title */}
                <h1 className='text-cyan-600 text-5xl' style={{ fontFamily: "'BBH Bartle', sans-serif" }}>
                    Photo Albums
                </h1>

                {/* Sub Text */}
                <h1 className='text-black text-lg py-3' style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Trip down memory lane!
                </h1>
            </div>
            
            {/* Events Section */}
            <div className="space-y-8">
            {groupedEvents.length === 0 ? (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    No albums available yet
                </p>
                </div>
            ) : (
                groupedEvents.map((event, idx) => (
                <div key={idx} className="space-y-4">
                    {/* Event Name */}
                    <h2 
                    className="text-2xl md:text-3xl font-semibold text-gray-800 pl-2"
                    style={{ fontFamily: 'Ubuntu, sans-serif' }}
                    >
                    {event.eventName}
                    </h2>

                    {/* Links for this event */}
                    <div className="space-y-3">
                    {event.links.map((link) => (
                        <button
                        key={link.id}
                        onClick={() => handleLinkClick(link.id, link.url)}
                        className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-400 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                        >
                        <div className="flex items-center justify-between">
                            {/* Link Title */}
                            <div className="flex items-center gap-3 flex-1">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-2 group-hover:scale-110 transition-transform">
                                <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                            <span 
                                className="text-lg font-semibold text-gray-800 text-left"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                {link.title}
                            </span>
                            </div>

                            {/* Click Count */}
                            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                            <Eye className="w-4 h-4 text-purple-600" />
                            <span 
                                className="text-sm font-medium text-purple-700"
                                style={{ fontFamily: 'Ubuntu, sans-serif' }}
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
            <div className="mt-16 text-center">
            <p 
                className="text-sm text-gray-500"
                style={{ fontFamily: 'Poppins, sans-serif' }}
            >
                Made with ❤️ for memories
            </p>
            </div>
        </div>
    );
}

export default LandingPage;