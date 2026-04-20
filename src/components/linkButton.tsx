import { ExternalLink, Eye } from 'lucide-react';
import { incrementClickCount } from './supabase';
import type { EventLink } from '../types/types';

interface Props {
    link: EventLink;
}

export const LinkButton = ({ link }: Props) => {
    const handleClick = () => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
        incrementClickCount(link.id);
    };

    return (
        <button
            onClick={handleClick}
            className="w-full bg-gray-900/60 backdrop-blur-md hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-blue-900/40 border border-gray-700 hover:border-cyan-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-0.5 group"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                        <ExternalLink className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <span
                        className="text-lg md:text-xl font-semibold text-gray-100 text-left truncate"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {link.title}
                    </span>
                </div>
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
    );
};