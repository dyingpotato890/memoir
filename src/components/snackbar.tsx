import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export const ReportSnackbar = ({ onDismiss }: { onDismiss: () => void }) => {
    useEffect(() => {
        const t = setTimeout(onDismiss, 5000);
        return () => clearTimeout(t);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
            <div className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-md border border-green-500/30 rounded-2xl px-5 py-3 shadow-xl shadow-black/40">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Report submitted
                    </p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Successfully submitted. Please wait for the review!
                    </p>
                </div>
                <button
                    onClick={onDismiss}
                    className="ml-2 text-gray-600 hover:text-gray-400 transition-colors text-lg leading-none"
                >
                </button>
            </div>
        </div>
    );
};