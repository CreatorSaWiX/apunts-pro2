import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

import Spinner from '../ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

export interface Attachment {
    url: string;
    name: string;
    type: string;
    size: number;
    thumbnailUrl?: string;
}

interface FileUploaderProps {
    onUploadComplete: (attachments: Attachment[]) => void;
    maxFiles?: number;
    variant?: 'default' | 'avatar';
}

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FileUploader = ({ onUploadComplete, maxFiles = 3, variant = 'default' }: FileUploaderProps) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const uploadToR2 = async (fileOrBlob: File | Blob, filename: string, contentType: string) => {
        const res = await fetch('/api/r2-presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, contentType })
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.error || "Error obtenint URL de pujada. Tens el .env configurat?");
        }
        
        const { presignedUrl, publicUrl } = await res.json();
        
        console.log("URL de pujada R2:", presignedUrl);
        
        const uploadRes = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType
            },
            body: fileOrBlob
        }).catch(err => {
            console.error("Fetch Error:", err);
            throw new Error(`Failed to fetch (CORS o Xarxa).\\nURL intentada: ${presignedUrl}\\nError original: ${err.message}`);
        });
        
        if (!uploadRes.ok) throw new Error(`Error HTTP: ${uploadRes.status} pujant a R2`);
        
        return publicUrl;
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setUploading(true);
        setProgress(0);
        
        const uploadedAttachments: Attachment[] = [];
        
        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i];
            
            try {
                setProgress(((i) / acceptedFiles.length) * 100);
                
                // 1. Generate preview
                const { generatePreview } = await import('../../lib/previewGenerator');
                const previewUrl = await generatePreview(file);
                
                // 2. Upload main file
                const filePublicUrl = await uploadToR2(file, file.name, file.type || 'application/octet-stream');
                
                // 3. Upload thumbnail if it's a generated dataUrl
                let thumbnailPublicUrl = undefined;
                if (previewUrl && previewUrl.startsWith('data:')) {
                    const blob = dataURLtoBlob(previewUrl);
                    if (blob) {
                        thumbnailPublicUrl = await uploadToR2(
                            blob, 
                            `thumb_${file.name.split('.')[0] || 'img'}.jpg`, 
                            'image/jpeg'
                        );
                    }
                } else {
                    thumbnailPublicUrl = previewUrl;
                }
                
                uploadedAttachments.push({
                    url: filePublicUrl, 
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    thumbnailUrl: thumbnailPublicUrl
                });
                
                setProgress(((i + 1) / acceptedFiles.length) * 100);
            } catch (err: any) {
                console.error("Error pujant arxiu:", err);
                alert(`Error amb ${file.name}: ${err.message}`);
            }
        }
        
        setUploading(false);
        onUploadComplete(uploadedAttachments);
    }, [maxFiles, onUploadComplete]);

    const onDropRejected = useCallback((fileRejections: any[]) => {
        const errors = fileRejections.map(r => {
            if (r.errors.find((e: any) => e.code === 'file-too-large')) {
                return `L'arxiu "${r.file.name}" és massa gran. El límit és de ${MAX_FILE_SIZE_MB}MB.`;
            }
            return `L'arxiu "${r.file.name}" no s'ha pogut pujar. Format no acceptat o massa gran.`;
        });
        alert(errors.join('\\n'));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles,
        maxSize: MAX_FILE_SIZE_BYTES,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/zip': ['.zip', '.rar'],
            'video/*': ['.mp4', '.webm', '.ogg', '.mov'],
            'text/javascript': ['.js', '.jsx'],
            'text/typescript': ['.ts', '.tsx'],
            'text/plain': ['.txt', '.cc', '.cpp', '.c', '.h', '.hpp'],
            'model/gltf-binary': ['.glb'],
            'model/gltf+json': ['.gltf']
        }   
    });

    return (
        <div className={`w-full ${variant === 'avatar' ? 'h-full' : 'mt-2'}`}>
            {!uploading && (
                <div 
                    {...getRootProps()} 
                    className={variant === 'avatar' 
                        ? 'absolute inset-0 cursor-pointer z-10 outline-none'
                        : `border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(14,165,233,0.2)]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`
                    }
                >
                    <input {...getInputProps()} />
                    {variant === 'default' && (
                        <>
                            <UploadCloud className="mx-auto mb-2 text-slate-400" size={24} />
                            <p className="text-sm font-bold text-slate-300">Arrossega arxius per adjuntar</p>
                            <p className="text-xs text-slate-500 mt-1">Codi, PDFs, Vídeos, 3D, Imatges, ZIP (Màxim {MAX_FILE_SIZE_MB}MB per arxiu)</p>
                        </>
                    )}
                </div>
            )}

            <AnimatePresence>
                {uploading && (
                    <motion.div 
                        initial={{ opacity: 0, height: variant === 'avatar' ? '100%' : 0 }}
                        animate={{ opacity: 1, height: variant === 'avatar' ? '100%' : 'auto' }}
                        exit={{ opacity: 0, height: variant === 'avatar' ? '100%' : 0 }}
                        className={`flex flex-col items-center justify-center ${variant === 'avatar' ? 'absolute inset-0 bg-black/60 z-20' : 'p-6 bg-white/5 border border-white/10 rounded-2xl'}`}
                    >
                        <Spinner size={variant === 'avatar' ? 'sm' : 'lg'} variant="primary" className={variant === 'avatar' ? '' : 'mb-3'} />
                        {variant !== 'avatar' && <p className="text-sm font-bold text-white">Preparant i pujant a la xarxa...</p>}
                        {variant !== 'avatar' && (
                            <div className="w-48 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden relative">
                                <motion.div 
                                    className="absolute left-0 top-0 bottom-0 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUploader;
