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
        <>
            {/* ── Desktop (md+) — original design ── */}
            <button
                onClick={handleClick}
                className="hidden md:flex w-full bg-gray-900/60 backdrop-blur-md hover:bg-gradient-to-r hover:from-cyan-900/40 hover:to-blue-900/40 border border-gray-700 hover:border-cyan-400 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-0.5 group items-center"
            >
                <div className="flex items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                            <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <span
                            className="text-lg md:text-xl font-semibold text-gray-100 text-left truncate"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {link.title}
                        </span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-3 py-1.5 md:px-5 md:py-2.5 rounded-full border border-cyan-400/30">
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

            {/* ── Mobile — full-width tap target, title wraps naturally ── */}
            <button
                onClick={handleClick}
                className="md:hidden w-full text-left group"
            >
                <div className="flex items-stretch gap-3 bg-gray-900/60 border border-gray-800 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-all duration-200 active:scale-[0.98]">
                    {/* Coloured left stripe + icon */}
                    <div className="flex-shrink-0 w-10 bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-r border-gray-800 flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-cyan-400" strokeWidth={2} />
                    </div>

                    {/* Title — allowed to wrap */}
                    <div className="flex-1 min-w-0 py-3 pr-2">
                        <span
                            className="text-sm font-semibold text-gray-100 leading-snug break-words"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {link.title}
                        </span>
                    </div>

                    {/* View count — stacked vertically so it doesn't fight the title */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center px-3 border-l border-gray-800/60 gap-0.5">
                        <Eye className="w-3 h-3 text-cyan-500/60" strokeWidth={2} />
                        <span
                            className="text-[11px] font-bold text-cyan-400/80 tabular-nums leading-none"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {link.click_count}
                        </span>
                    </div>
                </div>
            </button>
        </>
    );
};