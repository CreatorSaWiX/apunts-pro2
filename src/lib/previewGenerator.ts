// previewGenerator.ts

// Funció principal per generar thumbnails espectaculars per qualsevol fitxer
export const generatePreview = async (file: File): Promise<string> => {
    try {
        if (file.type.startsWith('image/')) {
            return await generateImageThumbnail(file);
        } else if (file.type.startsWith('video/')) {
            return await generateVideoThumbnail(file);
        } else if (file.type === 'application/pdf') {
            return await generatePdfThumbnail(file);
        } else {
            return generateGenericThumbnail(file.name);
        }
    } catch (error) {
        console.error("Error generant preview:", error);
        return generateGenericThumbnail(file.name);
    }
};

const generateImageThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            } else {
                resolve(img.src);
            }
        };
        img.onerror = () => resolve(generateGenericThumbnail(file.name));
    });
};

const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.crossOrigin = 'anonymous';
        
        video.onloadedmetadata = () => {
            video.currentTime = Math.min(1.5, video.duration / 2);
        };
        
        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Overlay d'estil Awwwards per indicar que és un vídeo
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Botó de Play
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = Math.max(40, canvas.width * 0.08);
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.stroke();

                // Triangle
                ctx.beginPath();
                ctx.moveTo(centerX - radius/4, centerY - radius/3);
                ctx.lineTo(centerX + radius/2, centerY);
                ctx.lineTo(centerX - radius/4, centerY + radius/3);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                ctx.fill();
                
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            } else {
                resolve(generateGenericThumbnail(file.name));
            }
        };
        video.onerror = () => resolve(generateGenericThumbnail(file.name));
    });
};

const generatePdfThumbnail = async (file: File): Promise<string> => {
    // Dynamic import to avoid blowing up the main bundle size
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 2.0 }); // High res for premium feel
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return generateGenericThumbnail(file.name);
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    // Fons blanc per si el PDF és transparent
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const renderContext: any = {
        canvasContext: ctx,
        viewport: viewport
    };
    
    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.9);
};

const generateGenericThumbnail = (filename: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    const ext = filename.split('.').pop()?.toLowerCase() || 'file';
    
    // Dynamic colors based on extension
    let colorStart = '#0f172a';
    let colorEnd = '#3b82f6';
    
    if (['js','ts','tsx','jsx','py','cpp','html','css','json'].includes(ext)) {
        colorStart = '#020617'; // slate-950
        colorEnd = '#0284c7'; // sky-600
    } else if (['gltf','glb','obj'].includes(ext)) {
        colorStart = '#022c22'; // teal-950
        colorEnd = '#10b981'; // emerald-500
    } else if (['zip','rar','tar'].includes(ext)) {
        colorStart = '#451a03'; // orange-950
        colorEnd = '#f59e0b'; // amber-500
    }
    
    // Gradient fluid espectacular
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Textura de soroll suau / partícules
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for(let i=0; i<150; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 60 + 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Grid pattern subjacient per efecte tech
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Extensió
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 130px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.fillText(ext.toUpperCase(), canvas.width / 2, canvas.height / 2 - 30);
    
    // Nom del fitxer petit a sota
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 28px Inter, sans-serif';
    
    let displayFilename = filename;
    if (displayFilename.length > 35) {
        displayFilename = displayFilename.substring(0, 32) + '...';
    }
    
    ctx.fillText(displayFilename, canvas.width / 2, canvas.height / 2 + 80);
    
    return canvas.toDataURL('image/jpeg', 0.9);
};
