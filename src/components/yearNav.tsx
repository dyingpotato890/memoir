interface Props {
    years: string[];
}

export const YearNav = ({ years }: Props) => {
    const scrollToYear = (year: string) => {
        const element = document.getElementById(`year-${year}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (years.length <= 1) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
            {years.map((year) => (
                <button
                    key={year}
                    onClick={() => scrollToYear(year)}
                    className="px-4 py-1.5 rounded-full bg-gray-900/40 backdrop-blur-md border border-gray-800 text-xs font-bold text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 tracking-widest uppercase"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {year}
                </button>
            ))}
        </div>
    );
};
