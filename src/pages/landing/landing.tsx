import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";

import loadEvents  from '../../components/supabase';

interface Event {
    id: number,
    title: string,
    url: string,
    click_count: number,
    event_name: string,
}

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
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const init = async () => {
            loadFonts();
            const data = await loadEvents();
            setEvents(data);
            setIsLoading(false);
        };
        
        init();

        console.log(events);
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading photo albums...</p>
            </div>
        )
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
            
        </div>
    );
}

export default LandingPage;