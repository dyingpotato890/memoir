import { LinkButton } from './linkButton';
import type { GroupedEvent, Link } from '../types/types';
import { getRelativeTime } from '../utils/dateUtils';
import { Clock } from 'lucide-react';
import { useState } from 'react';

interface Props {
    event: GroupedEvent;
}

const groupLinksByDate = (links: Link[]): Map<string | null, Link[]> => {
    const map = new Map<string | null, Link[]>();
    for (const link of links) {
        const key = link.link_date ?? null;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(link);
    }
    return map;
};

const isRange = (event: GroupedEvent) =>
    event.startDate && event.endDate && event.startDate !== event.endDate;

interface LinkRowProps { link: Link; }
const LinkRow = ({ link }: LinkRowProps) => (
    <div className="flex flex-col gap-1">
        <LinkButton link={link} />
    </div>
);

// Formats a date string as "14 Nov" style
const shortDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

// Formats just the month+day for range display on left: "14–17 Nov"
const rangeShort = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const sDay = s.getDate();
    const eDay = e.getDate();
    const month = e.toLocaleDateString('en-GB', { month: 'short' });
    return `${sDay}–${eDay} ${month}`;
};

export const EventCard = ({ event }: Props) => {
    const [expanded, setExpanded] = useState(true);

    const range = isRange(event);
    const relativeTime = event.endDate ? getRelativeTime(event.endDate) : null;
    const linksByDate = groupLinksByDate(event.links);
    const hasDayGrouping = [...linksByDate.keys()].some(k => k !== null);

    const sortedDateKeys = [...linksByDate.keys()].sort((a, b) => {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        return new Date(a).getTime() - new Date(b).getTime();
    });

    // What to show in the left date column
    const dateLabel = event.startDate
        ? range
            ? rangeShort(event.startDate, event.endDate!)
            : shortDate(event.startDate)
        : null;

    // Month label (shown above the day number for single dates)
    const monthLabel = event.startDate && !range
        ? new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
        : null;

    return (
        /*
          Two-column layout:
          [  date col  ] [ node ] [        card        ]
          120px / 160px    9px      flex-1
        */
        <div className="relative flex items-start gap-0 group">

            {/* ── Left: date label ── */}
            <div className="w-[120px] md:w-[160px] shrink-0 flex flex-col items-end pr-5 pt-3 select-none">
                {dateLabel ? (
                    range ? (
                        /* Range: single compact string */
                        <span className="text-sm font-bold text-gray-400 tracking-wide text-right leading-snug">
                            {dateLabel}
                        </span>
                    ) : (
                        /* Single date: stacked month / day */
                        <div className="flex flex-col items-end leading-none gap-0.5">
                            <span className="text-[11px] font-black tracking-[0.15em] text-cyan-500/60 uppercase">
                                {monthLabel}
                            </span>
                            <span className="text-lg font-bold text-gray-300 tabular-nums">
                                {new Date(event.startDate!).getDate()}
                            </span>
                        </div>
                    )
                ) : (
                    <span className="text-[10px] text-gray-700 italic">—</span>
                )}
            </div>

            {/* ── Centre: timeline node ── */}
            <div className="relative z-20 shrink-0 flex flex-col items-center" style={{ width: 9 }}>
                {/* Node sits at the top of the card */}
                <div className="mt-[14px]">
                    <div className="absolute inset-0 rounded-full bg-cyan-400 blur-sm opacity-30 group-hover:opacity-70 transition-opacity duration-400 w-3.5 h-3.5 -translate-x-[3px] -translate-y-[1px]" />
                    <div className="w-[9px] h-[9px] rounded-full bg-gray-900 border-2 border-cyan-400/70 relative z-10 group-hover:border-cyan-300 group-hover:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.35)]" />
                </div>
            </div>

            {/* ── Right: card ── */}
            <div className="flex-1 ml-4 min-w-0 pb-3">
                <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/60 overflow-hidden transition-all duration-300 group-hover:border-cyan-500/20 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.04)]">

                    {/* Card header */}
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/[0.015] transition-colors duration-200"
                    >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                            <h2
                                className="text-base md:text-lg font-black text-white tracking-tight group-hover:text-cyan-100 transition-colors duration-300 leading-snug truncate"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {event.eventName}
                            </h2>

                            {relativeTime && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                                    <Clock className="w-2.5 h-2.5 text-cyan-400" />
                                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider tabular-nums">
                                        {relativeTime}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-gray-700 font-medium tabular-nums hidden sm:block">
                                {event.links.length} link{event.links.length !== 1 ? 's' : ''}
                            </span>
                            <div className={`w-4 h-4 rounded-full border border-gray-800 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                                <svg className="w-2 h-2 text-gray-600" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Card body */}
                    {expanded && (
                        <div className="border-t border-gray-800/50 px-4 py-3">
                            {hasDayGrouping ? (
                                /* Day-grouped: two-column within the card */
                                <div className="space-y-4">
                                    {sortedDateKeys.map((dateKey) => {
                                        const dayLinks = linksByDate.get(dateKey)!;
                                        return (
                                            <div key={dateKey ?? '__undated'} className="flex gap-3">
                                                {/* Day label */}
                                                <div className="w-14 shrink-0 pt-0.5">
                                                    {dateKey ? (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[10px] font-black text-cyan-400/70 uppercase tracking-widest">
                                                                {new Date(dateKey).toLocaleDateString('en-GB', { weekday: 'short' })}
                                                            </span>
                                                            <span className="text-sm font-semibold text-gray-400">
                                                                {new Date(dateKey).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-700 italic">—</span>
                                                    )}
                                                </div>

                                                {/* Divider */}
                                                <div className="w-px bg-gray-800/80 self-stretch" />

                                                {/* Links */}
                                                <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                                                    {dayLinks.map(link => <LinkRow key={link.id} link={link} />)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Flat grid */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {event.links.map(link => <LinkRow key={link.id} link={link} />)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};