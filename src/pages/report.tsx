import { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Send, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldBackground from '../components/background';
import { submitReport } from '../components/supabase';

interface FileRow {
    id: number;
    filename: string;
    reason: string;
    filenameError: string | null;
    filenameTouched: boolean;
}

const REASONS = [
    'link oombi',
    'aa chapter close aayi',
    'ithu public aayaal pani aavum',
    'shitty pic',
    'nee ariyanda',
];

let rowCounter = 0;
const emptyRow = (): FileRow => ({ id: ++rowCounter, filename: '', reason: '', filenameError: null, filenameTouched: false });

const validateFilename = (value: string): string | null => {
    if (!value.trim()) return 'File name is required';
    return null;
};

interface Props {
    eventName: string;
    onBack: (submitted?: boolean) => void;
}

export const ReportPage = ({ eventName, onBack }: Props) => {
    const [rows, setRows] = useState<FileRow[]>([emptyRow()]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateRow = (id: number, field: keyof FileRow, value: string) => {
        setRows(prev => prev.map(r => {
            if (r.id !== id) return r;
            if (field === 'filename') {
                return {
                    ...r,
                    filename: value,
                    filenameError: r.filenameTouched ? validateFilename(value) : null,
                };
            }
            return { ...r, [field]: value };
        }));
    };

    const blurFilename = (id: number) => {
        setRows(prev => prev.map(r =>
            r.id !== id ? r : { ...r, filenameTouched: true, filenameError: validateFilename(r.filename) }
        ));
    };

    const addRow = () => setRows(prev => [...prev, emptyRow()]);
    const removeRow = (id: number) => rows.length > 1 && setRows(prev => prev.filter(r => r.id !== id));

    const handleSubmit = async () => {
        const validated = rows.map(r => ({
            ...r,
            filenameTouched: true,
            filenameError: validateFilename(r.filename),
        }));
        setRows(validated);

        const hasFilenameError = validated.some(r => r.filenameError);
        const hasEmptyReason = validated.some(r => !r.reason);

        if (hasFilenameError || hasEmptyReason) {
            setError(hasEmptyReason ? 'Pick a reason for each file' : null);
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            await submitReport(eventName, rows.map(r => ({
                filename: r.filename.trim(),
                reason: r.reason,
            })));
            onBack(true);
        } catch {
            setError('Submission failed. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[100dvh] text-slate-200 font-sans selection:bg-cyan-500/30">
            <StarfieldBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-[100dvh]">

                {/* Top Nav */}
                <nav className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => onBack(false)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="text-right">
                        <span className="block text-[10px] font-black tracking-[0.2em] text-cyan-500 uppercase">Reporting for</span>
                        <span className="text-sm font-medium text-white/60">{eventName}</span>
                    </div>
                </nav>

                {/* Main Glass Terminal */}
                <main className="flex-1 flex flex-col bg-gray-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Terminal Header */}
                    <header className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <h1 className="text-sm font-bold tracking-tight uppercase text-white/80">Issue Submission Queue</h1>
                        </div>
                        <div className="text-[10px] font-mono text-white/40">
                            ITEMS_COUNT: {rows.length}
                        </div>
                    </header>

                    {/* Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <AnimatePresence initial={false}>
                            {rows.map((row, index) => (
                                <motion.div
                                    key={row.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6"
                                >
                                    <div className="space-y-4">
                                        {/* Filename input */}
                                        <div className="flex items-start gap-3 group">
                                            <div className="text-xs font-mono text-white/20 group-focus-within:text-cyan-400 transition-colors pt-2.5">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="relative">
                                                    <FileText className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <input
                                                        placeholder="File name (e.g. IMG_4820.jpg)"
                                                        value={row.filename}
                                                        onChange={e => updateRow(row.id, 'filename', e.target.value)}
                                                        onBlur={() => blurFilename(row.id)}
                                                        className={`w-full bg-transparent border-b pl-7 pr-4 py-2 text-sm focus:outline-none transition-colors placeholder:text-white/10 ${
                                                            row.filenameError
                                                                ? 'border-red-500/60 text-red-300'
                                                                : 'border-white/10 focus:border-cyan-500'
                                                        }`}
                                                    />
                                                </div>
                                                <AnimatePresence>
                                                    {row.filenameError && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -4 }}
                                                            className="text-[10px] font-bold text-red-400 uppercase tracking-wider pl-7"
                                                        >
                                                            {row.filenameError}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Reason chips */}
                                        <div className="flex flex-wrap gap-2 ml-7">
                                            {REASONS.map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => updateRow(row.id, 'reason', reason)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                        row.reason === reason
                                                            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                                                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:text-cyan-300/60'
                                                    }`}
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row actions */}
                                    <div className="flex md:flex-col items-center justify-end gap-2">
                                        {rows.length > 1 && (
                                            <button
                                                onClick={() => removeRow(row.id)}
                                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add row */}
                        <button
                            onClick={addRow}
                            className="ml-7 flex items-center gap-2 text-white/30 hover:text-cyan-400 transition-colors group py-2"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Entry</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <footer className="p-6 bg-black/40 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 flex items-start gap-3 text-white/40">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="text-[11px] leading-relaxed">
                                    Reports are encrypted and sent to the moderation queue (lies). Privacy requests are flagged for immediate deletion. (mood indengil)
                                </p>
                            </div>

                            <div className="w-full md:w-auto flex flex-col items-end gap-2">
                                {error && (
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                                        {error}
                                    </span>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full md:w-48 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500/80 hover:to-blue-500/80 disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 border border-cyan-500/30 disabled:border-transparent text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            Dispatch
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};