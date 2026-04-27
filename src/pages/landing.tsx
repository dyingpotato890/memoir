import { useState, useEffect } from 'react';

import StarfieldBackground from "../components/background";
import { EventCard } from "../components/eventCard";
import { PageFooter } from "../components/footer";
import { PageHeader } from "../components/header";
import { LoadingScreen } from "../components/loading";
import { ReportPage } from "../pages/report";
import { useEvents } from "../hooks/useEvents";
import { useFontLoader } from "../hooks/useFontLoader";
import type { GroupedEvent } from "../types/types";
import { ReportSnackbar } from '../components/snackbar';

// --- Helpers ---
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

const YearBreak = ({ year }: { year: string }) => (
    <div id={`year-${year}`} className="relative flex items-center mb-5 mt-1 first:mt-0 scroll-mt-24">
        <div className="w-[60px] md:w-[160px] shrink-0 flex justify-end pr-3 md:pr-5">
            <span
                className="text-sm md:text-xl font-black tracking-[0.2em] uppercase text-cyan-500/50 select-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {year}
            </span>
        </div>
        <div className="relative z-20 shrink-0 w-[9px] h-[9px] flex items-center justify-center">
            <div
                className="w-[7px] h-[7px] bg-gray-900 border border-cyan-400/50 relative z-10 shadow-[0_0_6px_rgba(34,211,238,0.25)]"
                style={{ transform: 'rotate(45deg)' }}
            />
        </div>
        <div className="flex-1 ml-4 h-px bg-gradient-to-r from-cyan-500/25 via-gray-700/30 to-transparent" />
    </div>
);

const LandingPage = () => {
    // --- Data & State ---
    useFontLoader();
    const { isLoading, groupedEvents } = useEvents();

    const [reportingEvent, setReportingEvent] = useState<string | null>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);

    // Push history entry so browser back closes the report instead of leaving
    const openReport = (name: string) => {
        window.history.pushState({ report: name }, '');
        setReportingEvent(name);
    };

    // Close report on browser back
    useEffect(() => {
        const handlePop = () => setReportingEvent(null);
        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop);
    }, []);

    if (isLoading) return <LoadingScreen />;

    if (reportingEvent !== null) {
        return (
            <ReportPage
                eventName={reportingEvent}
                onBack={(submitted) => {
                    // Synchronize history if closed via UI
                    window.history.back();
                    if (submitted) setShowSnackbar(true);
                }}
            />
        );
    }

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
                <div className="max-w-7xl mx-auto px-3 md:px-8 pt-8 md:pt-16 pb-12 md:pb-24">
                    <PageHeader />


                    {/* --- Timeline Content --- */}
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
                                <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 64 }}>
                                    <div className="md:hidden w-px h-full bg-gradient-to-b from-transparent via-cyan-500/35 to-transparent" />
                                </div>
                                <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 164 }}>
                                    <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-cyan-500/35 to-transparent" />
                                </div>

                                <div className="space-y-0">
                                    {sortedYears.map((year) => (
                                        <div key={year}>
                                            <YearBreak year={year} />
                                            <div className="space-y-2 mb-10">
                                                {byYear.get(year)!.map((event, idx) => (
                                                    <EventCard
                                                        key={idx}
                                                        event={event}
                                                        onReport={openReport}
                                                    />
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

            {showSnackbar && <ReportSnackbar onDismiss={() => setShowSnackbar(false)} />}
        </>
    );
};

export default LandingPage;