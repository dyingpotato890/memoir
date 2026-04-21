import StarfieldBackground from "../components/background";
import { EventCard } from "../components/eventCard";
import { PageFooter } from "../components/footer";
import { PageHeader } from "../components/header";
// import { YearNav } from "../components/yearNav";
import { LoadingScreen } from "../components/loading";
import { useEvents } from "../hooks/useEvents";
import { useFontLoader } from "../hooks/useFontLoader";
import type { GroupedEvent } from "../types/types";

// Groups events by year (based on startDate, fallback to endDate, fallback to "Undated")
const groupEventsByYear = (events: GroupedEvent[]): Map<string, GroupedEvent[]> => {
    const map = new Map<string, GroupedEvent[]>();
    for (const event of events) {
        const dateStr = event.startDate ?? event.endDate;
        const year = dateStr ? new Date(dateStr).getFullYear().toString() : "Undated";
        if (!map.has(year)) map.set(year, []);
        map.get(year)!.push(event);
    }
    return map;
};

// The year separator — a horizontal rule with the year label bridging the timeline
const YearBreak = ({ year }: { year: string }) => (
    <div id={`year-${year}`} className="relative flex items-center mb-5 mt-1 first:mt-0 scroll-mt-24">
        {/* Date column — year label right-aligned */}
        <div className="w-[60px] md:w-[160px] shrink-0 flex justify-end pr-5">
            <span
                className="text-xl font-black tracking-[0.2em] uppercase text-cyan-500/50 select-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {year}
            </span>
        </div>

        {/* Diamond node on the line */}
        <div className="relative z-20 shrink-0 w-[9px] h-[9px] flex items-center justify-center">
            <div
                className="w-[7px] h-[7px] bg-gray-900 border border-cyan-400/50 relative z-10 shadow-[0_0_6px_rgba(34,211,238,0.25)]"
                style={{ transform: 'rotate(45deg)' }}
            />
        </div>

        {/* Horizontal rule to the right */}
        <div className="flex-1 ml-4 h-px bg-gradient-to-r from-cyan-500/25 via-gray-700/30 to-transparent" />
    </div>
);

const LandingPage = () => {
    useFontLoader();
    const { isLoading, groupedEvents } = useEvents();

    if (isLoading) return <LoadingScreen />;

    const byYear = groupEventsByYear(groupedEvents);
    const sortedYears = [...byYear.keys()].sort((a, b) => {
        if (a === "Undated") return 1;
        if (b === "Undated") return -1;
        return parseInt(a) - parseInt(b);
    });

    return (
        <>
            <StarfieldBackground />
            <div className="min-h-screen relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-12 md:pb-24">
                    <PageHeader />
                    {/* <YearNav years={sortedYears} /> */}

                    <div className="relative mt-8 md:mt-12">
                        {groupedEvents.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-800 p-12 max-w-md mx-auto">
                                    <p className="text-gray-500 text-lg font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        The memoir is currently empty
                                    </p>
                                    <p className="text-gray-600 text-sm mt-2">
                                        Add events to your timeline to see them here
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {/*
                                  Single continuous vertical line.
                                  Left offset = date column width + half the node (4px to center).
                                  Mobile: 120px, md: 160px
                                */}
                                <div
                                    className="absolute top-0 bottom-0 pointer-events-none"
                                    style={{ left: 64 }}
                                >
                                    <div className="md:hidden w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
                                </div>
                                <div
                                    className="absolute top-0 bottom-0 pointer-events-none"
                                    style={{ left: 164 }}
                                >
                                    <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
                                </div>

                                <div className="space-y-0">
                                    {sortedYears.map((year) => (
                                        <div key={year}>
                                            <YearBreak year={year} />
                                            <div className="space-y-2 mb-10">
                                                {byYear.get(year)!.map((event, idx) => (
                                                    <EventCard key={idx} event={event} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <PageFooter />
                </div>
            </div>
        </>
    );
};

export default LandingPage;