import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, File, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Attachment {
    url: string;
    name: string;
    type: string;
    size: number;
}

interface FileUploaderProps {
    onUploadComplete: (attachments: Attachment[]) => void;
    maxFiles?: number;
}

const FileUploader = ({ onUploadComplete, maxFiles = 3 }: FileUploaderProps) => {
    const [files, setFiles] = useState<(File & { preview?: string })[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }));
        setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
    }, [maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/zip': ['.zip', '.rar']
        }
    });

    const removeFile = (name: string) => {
        setFiles(files.filter(file => file.name !== name));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setProgress(0);
        
        const uploadedAttachments: Attachment[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                // S'utilitza una pujada simulada per donar resposta a la restricció "sense firebase, gratuït"
                // Per a un entorn de producció Awwwards, es recomana Catbox API o Cloudinary (unsigned preset).
                setProgress(((i) / files.length) * 100);
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
                
                // Si l'arxiu és petit, podem guardar-lo com a DataURI (Base64) a Firestore directament.
                // Com que això és un MVP de disseny visual, simulem el comportament.
                uploadedAttachments.push({
                    url: file.preview || URL.createObjectURL(file), // Blob local
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
                setProgress(((i + 1) / files.length) * 100);
            } catch (err) {
                console.error("Upload failed", err);
            }
        }
        
        setUploading(false);
        onUploadComplete(uploadedAttachments);
        setFiles([]);
    };

    return (
        <div className="w-full mt-4">
            {files.length === 0 && !uploading && (
                <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragActive ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mx-auto mb-3 text-slate-400" size={32} />
                    <p className="text-sm font-bold text-slate-300">Arrossega arxius o clica per pujar</p>
                    <p className="text-xs text-slate-500 mt-1">PDFs, Imatges, ZIP (Max {maxFiles} arxius)</p>
                </div>
            )}

            <AnimatePresence>
                {files.length > 0 && !uploading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                    >
                        {files.map((file) => (
                            <div key={file.name} className="relative group bg-white/5 border border-white/10 rounded-xl p-2 flex items-center gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                                {file.preview ? (
                                    <img src={file.preview} alt={file.name} className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <File size={20} className="text-slate-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                                    <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); handleUpload(); }}
                            className="col-span-full mt-2 w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                        >
                            Confirmar i Pujar Arxius
                        </button>
                    </motion.div>
                )}

                {uploading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 bg-white/5 border border-white/10 rounded-2xl"
                    >
                        <Loader2 className="animate-spin text-primary mb-3" size={32} />
                        <p className="text-sm font-bold text-slate-300">Pujant a la xarxa...</p>
                        <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <motion.div 
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUploader;
