import { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Send, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldBackground from '../components/background';
import { submitReport } from '../components/supabase';

interface LinkRow {
    id: number;
    url: string;
    reason: string;
}

const REASONS = [
    'link oombi',
    'delete cheythaal nallath ayrn 🙂',
    'ithu public aayaal pani aavum',
    'shitty pic',
    'nee ariyanda',
];

let rowCounter = 0;
const emptyRow = (): LinkRow => ({ id: ++rowCounter, url: '', reason: '' });

interface Props {
    eventName: string;
    onBack: (submitted?: boolean) => void;
}

export const ReportPage = ({ eventName, onBack }: Props) => {
    const [rows, setRows] = useState<LinkRow[]>([emptyRow()]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateRow = (id: number, field: keyof LinkRow, value: string) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const addRow = () => setRows(prev => [...prev, emptyRow()]);
    const removeRow = (id: number) => rows.length > 1 && setRows(prev => prev.filter(r => r.id !== id));

    const handleSubmit = async () => {
        if (rows.some(r => !r.url.trim() || !r.reason)) {
            setError('All fields are required');
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            await submitReport(eventName, rows.map(r => ({
                url: r.url.trim(),
                reason: r.reason,
                reporter_name: null,
            })));
            onBack(true);
        } catch {
            setError('Submission failed. Try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[100dvh] text-slate-200 font-sans selection:bg-rose-500/30">
            <StarfieldBackground />

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-[100dvh]">
                
                {/* Minimal Top Nav */}
                <nav className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => onBack(false)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="text-right">
                        <span className="block text-[10px] font-black tracking-[0.2em] text-rose-500 uppercase">Reporting for</span>
                        <span className="text-sm font-medium text-white/60">{eventName}</span>
                    </div>
                </nav>

                {/* Main Glass Terminal */}
                <main className="flex-1 flex flex-col bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    
                    {/* Terminal Header */}
                    <header className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
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
                                    {/* Link Input Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 group">
                                            <div className="text-xs font-mono text-white/20 group-focus-within:text-rose-500 transition-colors">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="relative flex-1">
                                                <LinkIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <input
                                                    placeholder="Paste the problematic link here..."
                                                    value={row.url}
                                                    onChange={(e) => updateRow(row.id, 'url', e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/10 pl-7 pr-4 py-2 text-sm focus:outline-none focus:border-rose-500 transition-colors placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>

                                        {/* Reason Chips */}
                                        <div className="flex flex-wrap gap-2 ml-7">
                                            {REASONS.map((reason) => (
                                                <button
                                                    key={reason}
                                                    onClick={() => updateRow(row.id, 'reason', reason)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                        row.reason === reason 
                                                        ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                                                    }`}
                                                >
                                                    {reason}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Row Actions */}
                                    <div className="flex md:flex-col items-center justify-end gap-2">
                                        {rows.length > 1 && (
                                            <button 
                                                onClick={() => removeRow(row.id)}
                                                className="p-2 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add Row Button */}
                        <button
                            onClick={addRow}
                            className="ml-7 flex items-center gap-2 text-white/30 hover:text-white transition-colors group py-2"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Entry</span>
                        </button>
                    </div>

                    {/* Action Footer */}
                    <footer className="p-6 bg-black/40 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 flex items-start gap-3 text-white/40">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="text-[11px] leading-relaxed">
                                    Reports are encrypted and sent to the moderation queue (lies). Privacy requests are flagged for immediate deletion. (mood indengil)
                                </p>
                            </div>
                            
                            <div className="w-full md:w-auto flex flex-col items-end gap-2">
                                {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">{error}</span>}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full md:w-48 relative overflow-hidden group bg-rose-600 hover:bg-rose-500 disabled:bg-white/10 disabled:text-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
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