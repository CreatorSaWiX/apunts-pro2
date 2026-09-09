import { memo } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PdfViewerProps {
    url: string;
    filename: string;
}

const PdfViewer = ({ url, filename }: PdfViewerProps) => {
    const { t } = useTranslation();

    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="w-full bg-[#1a1a1a] px-4 py-2 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-medium text-slate-300 truncate max-w-60 sm:max-w-md">{filename}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        PDF
                    </span>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                    title={t('common.openInNewTab', 'Obrir en pestanya nova')}
                    aria-label={t('common.openInNewTab', 'Obrir en pestanya nova')}
                >
                    <span className="hidden sm:inline">{t('common.open', 'Obrir')}</span>
                    <ExternalLink size={14} />
                </a>
            </div>
            <object 
                data={`${url}#toolbar=0&navpanes=0&scrollbar=0`} 
                type="application/pdf"
                className="w-full flex-1"
                aria-label={filename}
            >
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-3 p-6 text-center">
                    <p>{t('community.viewers.pdfUnsupported', 'El teu navegador no suporta la previsualització de PDFs incrustada.')}</p>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors font-medium flex items-center gap-2"
                    >
                        <ExternalLink size={16} />
                        {t('community.viewers.openDocument', 'Obrir document')}
                    </a>
                </div>
            </object>
        </div>
    );
};

export default memo(PdfViewer);
