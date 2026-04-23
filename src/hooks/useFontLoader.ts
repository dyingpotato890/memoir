import { useEffect } from 'react';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=BBH+Bartle&family=Cal+Sans&family=Poppins:wght@400;500;600&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap';

export const useFontLoader = () => {
    useEffect(() => {
        if (document.querySelector(`link[href="${FONT_URL}"]`)) return;
        const link = document.createElement('link');
        link.href = FONT_URL;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }, []);
};