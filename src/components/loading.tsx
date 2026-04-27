import StarfieldBackground from './background';
import { PageHeader } from './header';

// Fixed configs to avoid random re-renders — varied to feel natural
const CARD_CONFIGS = [
    { titleW: 200, hasDate: true },
    { titleW: 160, hasDate: true },
    { titleW: 240, hasDate: false },
    { titleW: 180, hasDate: true },
    { titleW: 220, hasDate: true },
    { titleW: 190, hasDate: false },
];

export const LoadingScreen = () => (
    <>
        <StarfieldBackground />
        <div className="min-h-screen relative z-10">
            <div className="max-w-7xl mx-auto px-3 md:px-8 pt-8 md:pt-16 pb-12 md:pb-24">

                <PageHeader />


                {/* --- Content Skeletons --- */}
                <div className="relative flex items-center mb-5 mt-8 md:mt-12">
                    <div className="w-[60px] md:w-[160px] shrink-0 flex justify-end pr-3 md:pr-5">
                        <div className="w-14 h-5 rounded bg-gray-800 animate-pulse" />
                    </div>
                    <div className="w-[9px] h-[9px] bg-gray-800 animate-pulse" style={{ transform: 'rotate(45deg)' }} />
                    <div className="flex-1 ml-4 h-px bg-gray-800/60" />
                </div>

                <div className="relative">
                    <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 64 }}>
                        <div className="md:hidden w-px h-full bg-gradient-to-b from-transparent via-cyan-500/35 to-transparent" />
                    </div>
                    <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 164 }}>
                        <div className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-cyan-500/35 to-transparent" />
                    </div>

                    <div className="space-y-2">
                        {CARD_CONFIGS.map((cfg, i) => (
                            <div key={i} className="relative flex items-start gap-0">
                                <div className="w-[60px] md:w-[160px] shrink-0 flex flex-col items-end pr-3 md:pr-5 pt-3 select-none">
                                    {cfg.hasDate && (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="block md:hidden w-10 h-3 rounded bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                                            <div className="hidden md:block w-7 h-2.5 rounded bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                                            <div className="hidden md:block w-6 h-[26px] rounded bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80 + 30}ms` }} />
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-20 shrink-0 flex flex-col items-center" style={{ width: 9 }}>
                                    <div
                                        className="mt-[14px] w-[9px] h-[9px] rounded-full bg-gray-800 border-2 border-gray-700 animate-pulse"
                                        style={{ animationDelay: `${i * 80}ms` }}
                                    />
                                </div>

                                <div className="flex-1 ml-3 md:ml-4 min-w-0 pb-3">
                                    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800/60 overflow-hidden">
                                        <div className="px-3 md:px-4 py-2.5 md:py-3 flex items-center justify-between gap-2">
                                            <div
                                                className="h-[22px] md:h-[26px] rounded bg-gray-800 animate-pulse"
                                                style={{ width: cfg.titleW, animationDelay: `${i * 80 + 50}ms` }}
                                            />
                                            <div className="w-4 h-4 rounded-full bg-gray-800 animate-pulse shrink-0" style={{ animationDelay: `${i * 80 + 60}ms` }} />
                                        </div>

                                        <div className="border-t border-gray-800/50 px-3 md:px-4 py-2.5 md:py-3">
                                            <div
                                                className="w-full h-[58px] md:h-[72px] rounded-2xl bg-gray-800/60 animate-pulse"
                                                style={{ animationDelay: `${i * 80 + 80}ms` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
);