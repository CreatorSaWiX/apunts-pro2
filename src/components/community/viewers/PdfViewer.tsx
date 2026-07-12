interface PdfViewerProps {
    url: string;
    filename: string;
}

const PdfViewer = ({ url, filename }: PdfViewerProps) => {
    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-full bg-[#1a1a1a] px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{filename}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">PDF Document</span>
            </div>
            <iframe 
                src={`${url}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-[calc(100%-36px)]"
                sandbox="allow-scripts allow-popups"
                title={filename}
            />
        </div>
    );
};

export default PdfViewer;
