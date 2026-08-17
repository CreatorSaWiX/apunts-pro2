import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PdfDropdownMenuProps {
    topicId: string;
    availablePdfs: { ca: boolean; es: boolean };
}

const PdfDropdownMenu = ({ topicId, availablePdfs }: PdfDropdownMenuProps) => {
    const { t } = useTranslation();
    const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

    if (!availablePdfs.ca && !availablePdfs.es) {
        return null;
    }

    return (
        <div className="relative shrink-0 self-center md:self-stretch flex items-center">
            <button
                type="button"
                onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                className="flex flex-col items-center justify-center gap-2 px-8 py-6 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border transition select-none bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 shadow-xl shadow-red-950/20 group min-w-30 h-full max-h-30"
                aria-label="Veure document">
                <FileText size={32} className="group-hover:scale-110 transition-transform duration-300" />
                <span>PDF</span>
            </button>
            
            <AnimatePresence>
                {isPdfMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-3 w-56 bg-[#0b1221]/90 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-[0_20px_50px_-12px_rgba(239,68,68,0.3)] z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
                            <span className="text-[10px] text-red-400/70 font-bold uppercase tracking-widest">{t('solutionsList.pdfLanguage', 'Idioma Solucionari')}</span>
                            <button
                                type="button"
                                onClick={() => setIsPdfMenuOpen(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                                aria-label="Tancar">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-2">
                            {availablePdfs.ca && topicId && (
                                <a
                                    href={`/pdfs/solucionaris/${topicId.split('-')[0]}/ca/solucionari-${topicId}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsPdfMenuOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition group"
                                    aria-label="Obrir panell">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                        <span className="text-xs font-bold text-red-400">CA</span>
                                    </div>
                                    <span>{t('common.languages.ca', 'Català')}</span>
                                </a>
                            )}
                            {availablePdfs.es && topicId && (
                                <a
                                    href={`/pdfs/solucionaris/${topicId.split('-')[0]}/es/solucionari-${topicId}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsPdfMenuOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl transition group"
                                    aria-label="Obrir panell">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                        <span className="text-xs font-bold text-red-400">ES</span>
                                    </div>
                                    <span>{t('common.languages.es', 'Español')}</span>
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PdfDropdownMenu;
