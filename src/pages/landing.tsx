import StarfieldBackground from "../components/background";
import { EventCard } from "../components/eventCard";
import { PageFooter } from "../components/footer";
import { PageHeader } from "../components/header";
import { LoadingScreen } from "../components/loading";
import { useEvents } from "../hooks/useEvents";
import { useFontLoader } from "../hooks/useFontLoader";


const LandingPage = () => {
    useFontLoader();
    const { isLoading, groupedEvents } = useEvents();

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            <StarfieldBackground />
            <div className="min-h-screen relative z-10">
                <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                    <PageHeader />

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
                                <EventCard key={idx} event={event} />
                            ))
                        )}
                    </div>

                    <PageFooter />
                </div>
            </div>
        </>
    );
};

export default LandingPage;