import { Loader2 } from 'lucide-react';
import StarfieldBackground from './background';

export const LoadingScreen = () => (
    <>
        <StarfieldBackground />
        <div className="min-h-screen flex items-center justify-center relative z-10">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                <p className="text-lg text-gray-200 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Loading photo albums...
                </p>
            </div>
        </div>
    </>
);