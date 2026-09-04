import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface PdfEmbedViewerProps {
    data: string;
    type?: string;
    width?: string | number;
    height?: string | number;
    title?: string;
    className?: string;
    children?: React.ReactNode;
}

export const PdfEmbedViewer: React.FC<PdfEmbedViewerProps> = ({
    data,
    title,
    className = ''
}) => {
    const { t } = useTranslation();

    const rawFilename = data.split('/').pop()?.split('?')[0] || 'document.pdf';
    const cleanName = rawFilename
        .replace(/\.pdf$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

    const displayName = title || cleanName;

    return (
        <div className={`my-8 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/50 backdrop-blur-xl not-prose flex flex-col transition-all ${className}`}>
            {/* Top Toolbar */}
            <div className="w-full bg-slate-900/90 px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-red-400 text-[11px] font-bold uppercase tracking-wider shrink-0">
                        <FileText size={13} className="text-red-400" />
                        PDF
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate" title={rawFilename}>
                        {displayName}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                    <a
                        href={data}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-95 shadow-xs cursor-pointer"
                        title={t('topic.openDocument', 'Obrir document')}
                    >
                        <ExternalLink size={13} className="text-slate-400" />
                        <span className="hidden sm:inline">{t('topic.open', 'Obrir')}</span>
                    </a>
                    <a
                        href={data}
                        download={rawFilename}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 hover:text-sky-300 border border-sky-500/30 hover:border-sky-500/50 transition-all active:scale-95 shadow-sm shadow-sky-950/20 cursor-pointer"
                        title={t('topic.download', 'Descarregar')}
                    >
                        <Download size={13} className="text-sky-400" />
                        <span>{t('topic.download', 'Descarregar')}</span>
                    </a>
                </div>
            </div>

            {/* Mobile Helper Hint */}
            <div className="sm:hidden px-4 py-2 bg-sky-500/5 border-b border-sky-500/10 flex items-center justify-between text-[11px] text-sky-300/80">
                <span>{t('topic.mobilePdfTip', 'Pots descarregar o obrir el document a pantalla completa.')}</span>
            </div>

            {/* Embedded PDF container */}
            <div className="relative w-full h-[55vh] min-h-[440px] max-h-[650px] sm:h-[700px] sm:max-h-none md:h-[800px] bg-slate-900/40">
                <object
                    data={`${data}#toolbar=1&navpanes=0`}
                    type="application/pdf"
                    className="w-full h-full block border-0"
                >
                    {/* Fallback for browsers / mobile webviews unable to render embedded PDF objects */}
                    <div className="w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-950/95 text-slate-300">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/30">
                            <FileText size={28} className="sm:hidden" />
                            <FileText size={34} className="hidden sm:block" />
                        </div>
                        <div className="max-w-md space-y-1.5">
                            <h4 className="text-base sm:text-lg font-bold text-white">
                                {displayName}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                {t('topic.pdfFallbackNotice', 'El teu navegador mòbil no permet previsualitzar el PDF aquí dins, però el pots obrir o descarregar directament amb els botons.')}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            <a
                                href={data}
                                download={rawFilename}
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                            >
                                <Download size={16} />
                                {t('topic.downloadPDF', 'Descarregar PDF')}
                            </a>
                            <a
                                href={data}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 text-white hover:bg-white/15 border border-white/10 transition-all active:scale-95 cursor-pointer"
                            >
                                <ExternalLink size={16} />
                                {t('topic.openDocument', 'Obrir document')}
                            </a>
                        </div>
                    </div>
                </object>
            </div>
        </div>
    );
};

export default PdfEmbedViewer;
