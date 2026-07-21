import { useEffect, useState } from 'react';
import { Download, Check, Trash2, FileText, ChevronDown, ChevronUp, Database, Info } from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';
import subjectsData from '../../data/subjects.json';
import { useTranslation } from 'react-i18next';
import { tailwindColors } from '../../contexts/SubjectContext';

const CORE_APP_SIZE = 3 * 1024 * 1024; // 3 MB

export const OfflineSection = () => {
    const { t } = useTranslation();
    const { offlineStorage, setOfflineStorage, customSubjectColors } = useSettings();
    const [storageDetails, setStorageDetails] = useState<{
        quota: number;
        usage: number;
        caches?: number;
        indexedDB?: number;
        serviceWorker?: number;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
    const [isDownloaded, setIsDownloaded] = useState<Record<string, boolean>>({});
    const [cacheSizes, setCacheSizes] = useState<Record<string, number>>({});
    const [manifest, setManifest] = useState<Record<string, string[]>>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    interface CacheInfo {
        name: string;
        size: number;
        files: { url: string; size: number, isOpaque?: boolean }[];
    }
    const [detailedCaches, setDetailedCaches] = useState<CacheInfo[]>([]);
    const [indexedDBs, setIndexedDBs] = useState<string[]>([]);
    const [expandedCache, setExpandedCache] = useState<string | null>(null);

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const updateQuota = () => {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then((estimate: any) => {
                setStorageDetails({
                    quota: estimate.quota || 0,
                    usage: estimate.usage || 0,
                    caches: estimate.usageDetails?.caches,
                    indexedDB: estimate.usageDetails?.indexedDB,
                    serviceWorker: estimate.usageDetails?.serviceWorkerRegistrations
                });
            });
        }
    };

    const loadDetailedStorageInfo = async () => {
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                const cachesData: CacheInfo[] = [];
                for (const name of cacheNames) {
                    const cache = await caches.open(name);
                    const requests = await cache.keys();
                    let totalSize = 0;
                    const files: { url: string; size: number; isOpaque?: boolean }[] = [];
                    for (const req of requests) {
                        const res = await cache.match(req);
                        if (res) {
                            let size = Number(res.headers.get('Content-Length')) || 0;
                            const isOpaque = res.type === 'opaque';
                            if (size === 0 && !isOpaque) {
                                try {
                                    const blob = await res.clone().blob();
                                    size = blob.size;
                                } catch (e) {
                                    // ignore
                                }
                            }
                            totalSize += size;
                            files.push({ url: req.url, size, isOpaque });
                        }
                    }
                    // Ordenem fitxers per mida descendent
                    files.sort((a, b) => b.size - a.size);
                    cachesData.push({ name, size: totalSize, files });
                }
                setDetailedCaches(cachesData);
            }
            if ('indexedDB' in window && indexedDB.databases) {
                const dbs = await indexedDB.databases();
                setIndexedDBs(dbs.map(db => db.name || 'Unknown'));
            }
        } catch (e) {
            console.error("Error loading detailed storage", e);
        }
    };

    const loadManifestAndCache = async () => {
        try {
            const res = await fetch('/offline-manifest.json');
            if (!res.ok) throw new Error("Could not fetch manifest");
            const data: Record<string, string[]> = await res.json();
            setManifest(data);

            const activeKeys = Object.keys(data).filter(k => data[k] && data[k].length > 0);

            // Check what is downloaded and their sizes
            const hasCache = await caches.has('offline-assets-custom');
            if (hasCache) {
                const cache = await caches.open('offline-assets-custom');
                const keys = await cache.keys();
                const downloadedStatus: Record<string, boolean> = {};
                const sizes: Record<string, number> = {};

                for (const req of keys) {
                    const url = new URL(req.url).pathname;
                    const cat = activeKeys.find(k => url.startsWith(`/${k}/`));
                    if (cat) {
                        downloadedStatus[cat] = true;
                        const response = await cache.match(req);
                        if (response) {
                            let size = Number(response.headers.get('Content-Length')) || 0;
                            if (size === 0 && response.type !== 'opaque') {
                                try {
                                    const blob = await response.clone().blob();
                                    size = blob.size;
                                } catch (e) {
                                    // ignore
                                }
                            }
                            sizes[cat] = (sizes[cat] || 0) + size;
                        }
                    }
                }
                setIsDownloaded(downloadedStatus);
                setCacheSizes(sizes);
            }
        } catch (err) {
            console.error("Error loading manifest", err);
        }
        updateQuota();
        loadDetailedStorageInfo();
    };

    useEffect(() => {
        loadManifestAndCache();
    }, []);

    const handleDownload = async (category: string) => {
        if (!navigator.onLine) {
            alert(t('settings.offline.noInternet', 'No pots descarregar contingut sense connexió a internet.'));
            return;
        }
        setIsProcessing(prev => ({ ...prev, [category]: true }));
        try {
            const urls = manifest[category] || [];
            const cache = await caches.open('offline-assets-custom');
            await cache.addAll(urls);

            await loadManifestAndCache(); // Refresh sizes
        } catch (error) {
            console.error(`Failed to cache ${category}:`, error);
        } finally {
            setIsProcessing(prev => ({ ...prev, [category]: false }));
        }
    };

    const handleDelete = async (category: string) => {
        setIsProcessing(prev => ({ ...prev, [category]: true }));
        try {
            const urls = manifest[category] || [];
            const cache = await caches.open('offline-assets-custom');
            for (const url of urls) {
                await cache.delete(url);
            }

            // Turn off auto sync
            setOfflineStorage(prev => ({ ...prev, [category]: false }));
            await loadManifestAndCache(); // Refresh sizes
        } catch (error) {
            console.error(`Failed to clear ${category}:`, error);
        } finally {
            setIsProcessing(prev => ({ ...prev, [category]: false }));
        }
    };

    const handleToggleSync = async (category: string, enabled: boolean) => {
        setOfflineStorage(prev => ({ ...prev, [category]: enabled }));

        if (enabled && !isDownloaded[category]) {
            handleDownload(category);
        }
    };

    const handleDeleteCacheFile = async (cacheName: string, fileUrl: string) => {
        try {
            const cache = await caches.open(cacheName);
            await cache.delete(fileUrl);
            await loadManifestAndCache();
        } catch (e) {
            console.error("Failed to delete cache file", e);
        }
    };

    const handleDeleteCache = async (cacheName: string) => {
        try {
            await caches.delete(cacheName);
            await loadManifestAndCache();
        } catch (e) {
            console.error("Failed to delete cache", e);
        }
    };

    const handleDeleteIndexedDB = async (dbName: string) => {
        try {
            if (window.indexedDB && window.indexedDB.deleteDatabase) {
                const req = window.indexedDB.deleteDatabase(dbName);
                req.onsuccess = async () => {
                    await loadManifestAndCache();
                };
                req.onerror = () => {
                    console.error("Failed to delete indexedDB", dbName);
                }
            }
        } catch (e) {
            console.error("Error deleting indexedDB", e);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        if (!bytes) return t('settings.offline.unknown', 'Desconegut');
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const currentUsage = storageDetails?.usage || 0;
    const hasDetails = storageDetails?.caches !== undefined;
    
    const customDownloadsSize = Object.values(cacheSizes).reduce((a, b) => a + b, 0);
    
    // Si l'API dona detalls exactes (Chrome/Edge/Brave), l'App Shell és tot allò catxejat MENYS el que hem descarregat nosaltres manualment. Si no, fallback de 3MB
    const appShellSize = hasDetails 
        ? Math.max(0, (storageDetails.caches || 0) + (storageDetails.serviceWorker || 0) - customDownloadsSize)
        : CORE_APP_SIZE;
        
    // IndexedDB amb detalls o fallback a la resta
    const indexedDbSize = hasDetails
        ? (storageDetails.indexedDB || 0)
        : Math.max(0, currentUsage - appShellSize - customDownloadsSize);

    const displayTotal = Math.max(currentUsage, appShellSize + customDownloadsSize + indexedDbSize) || 1;

    const corePercentage = (appShellSize / displayTotal) * 100;
    const otherPercentage = (indexedDbSize / displayTotal) * 100;

    const availableCategories = Object.keys(manifest)
        .filter(k => manifest[k] && manifest[k].length > 0)
        .map(key => {
            if (key === 'pdfs') {
                return {
                    id: 'pdfs',
                    title: t('settings.offline.pdfsTitle', 'Apunts en PDF'),
                    desc: t('settings.offline.pdfsDesc', 'Tota la col·lecció de PDFs del grau.'),
                    color: 'bg-rose-500',
                    colorText: 'text-rose-500',
                    hexColor: '#f43f5e',
                    filesCount: manifest[key].length
                };
            } else {
                const subject = subjectsData.find(s => s.name.toLowerCase() === key.toLowerCase());
                const defaultToken = subject?.colorToken?.split('-')[0] || 'sky';
                const finalColor = customSubjectColors?.[subject?.name || ''] || defaultToken;

                return {
                    id: key,
                    title: `${t('settings.offline.resourcesTitle', 'Recursos')} ${subject?.name || key.toUpperCase()}`,
                    desc: subject?.description || `${t('settings.offline.resourcesDesc', 'Material i recursos per a')} ${key.toUpperCase()}.`,
                    color: `bg-${finalColor}-500`,
                    colorText: `text-${finalColor}-500`,
                    hexColor: tailwindColors[finalColor]?.primary || '#0ea5e9',
                    filesCount: manifest[key].length
                };
            }
        });

    return (
        <div id="offline-storage" className="flex flex-col items-start gap-8 w-full pt-4 pb-12">
            <div className="w-full border-b border-white/10 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{t('settings.offline.title', 'Emmagatzematge Offline')}</h2>
                </div>
                <p className="text-slate-400 text-sm font-medium">{t('settings.offline.subtitle', 'Gestiona quines dades es guarden al dispositiu per accedir-hi sense internet.')}</p>
            </div>

            <div className="w-full">
                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-8 flex flex-col gap-8 mb-8 relative overflow-hidden">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-white font-bold text-xl mb-1">{t('settings.offline.local', 'Emmagatzematge Local')}</h3>
                            <p className="text-sm text-slate-400">{t('settings.offline.localSub', "Total ocupat per l'aplicació al teu dispositiu.")}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white">{formatBytes(currentUsage)}</span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden flex">
                            <div style={{ width: `${corePercentage}%` }} className="h-full bg-slate-500 transition-all duration-700" title="App Shell (JS/CSS/HTML)" />
                            {availableCategories.map(cat => {
                                if (!isDownloaded[cat.id]) return null;
                                const size = cacheSizes[cat.id] || 0;
                                const pct = (size / currentUsage) * 100;
                                return (
                                    <div key={cat.id} style={{ width: `${pct}%`, backgroundColor: cat.hexColor }} className="h-full transition-all duration-700 border-l border-black/20" title={cat.title} />
                                );
                            })}
                            {otherPercentage > 0 && (
                                <div style={{ width: `${otherPercentage}%` }} className="h-full bg-slate-700 transition-all duration-700 border-l border-black/20" title="IndexedDB / Metadades" />
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                                <span className="text-slate-400">{t('settings.offline.appShell', 'App Shell (JS/CSS/HTML)')} <span className="text-slate-500 ml-1">({formatBytes(appShellSize)})</span></span>
                            </div>
                            {availableCategories.map(cat => {
                                if (!isDownloaded[cat.id]) return null;
                                return (
                                    <div key={cat.id} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.hexColor }} />
                                        <span className="text-slate-400">{cat.id.toUpperCase()} <span className="text-slate-500 ml-1">({formatBytes(cacheSizes[cat.id])})</span></span>
                                    </div>
                                )
                            })}
                            {otherPercentage > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                    <span className="text-slate-400">{t('settings.offline.metadata', 'IndexedDB / Metadades')} <span className="text-slate-500 ml-1">({formatBytes(indexedDbSize)})</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {availableCategories.map((cat) => {
                        const isSyncEnabled = !!offlineStorage[cat.id];
                        const processing = isProcessing[cat.id];
                        const downloaded = isDownloaded[cat.id];

                        return (
                            <div key={cat.id} className="flex flex-col p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group transition-colors">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex items-center gap-5 flex-1 min-w-0 cursor-pointer group-hover:opacity-80 transition-opacity"
                                        onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all duration-300"
                                            style={{
                                                backgroundColor: downloaded ? `${cat.hexColor}20` : 'rgba(255,255,255,0.05)',
                                                borderColor: downloaded ? `${cat.hexColor}40` : 'rgba(255,255,255,0.05)'
                                            }}
                                        >
                                            <span
                                                className="text-[10px] uppercase font-black tracking-widest transition-colors duration-300"
                                                style={{ color: downloaded ? cat.hexColor : '#64748b' }}
                                            >
                                                {cat.id}
                                            </span>
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-bold text-white truncate">{cat.title}</h3>
                                                {downloaded && (
                                                    <span
                                                        className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: `${cat.hexColor}15`, color: cat.hexColor }}
                                                    >
                                                        {formatBytes(cacheSizes[cat.id])}
                                                    </span>
                                                )}
                                                {expandedCategory === cat.id ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                                            </div>
                                            <p className="text-slate-400 text-sm truncate">{cat.filesCount} {t('settings.offline.filesAvailable', 'arxius disponibles')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0 pl-4">
                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 w-32 justify-end">
                                            {downloaded ? (
                                                <button type="button"
                                                    disabled={processing}
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-sm transition-all disabled:opacity-50"
                                                >
                                                    {processing ? <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                                                    {t('settings.offline.delete', 'Eliminar')}
                                                </button>
                                            ) : (
                                                <button type="button"
                                                    disabled={processing || !isOnline}
                                                    onClick={() => handleDownload(cat.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-bold text-sm transition-all disabled:opacity-50"
                                                >
                                                    {processing ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Download size={16} />}
                                                    {t('settings.offline.download', 'Descarregar')}
                                                </button>
                                            )}
                                        </div>

                                        <div className="w-px h-8 bg-white/10" />

                                        {/* Auto-Sync Toggle */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-400 hidden sm:block">{t('settings.offline.autoSync', 'Actualització automàtica')}</span>
                                            <button type="button"
                                                onClick={() => handleToggleSync(cat.id, !isSyncEnabled)}
                                                className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none flex-shrink-0 ${isSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                                title="Sincronització automàtica"
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center ${isSyncEnabled ? 'translate-x-5' : 'translate-x-0'}`}>
                                                    {isSyncEnabled && <Check size={10} className="text-emerald-500" />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedCategory === cat.id && (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="w-full overflow-hidden border-t border-white/5 mt-5"
                                        >
                                            <div className="pt-4 flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                                {manifest[cat.id]?.map((fileUrl, idx) => {
                                                    const fileName = decodeURIComponent(fileUrl.split('/').pop() || '');
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <FileText size={16} className="text-slate-500 shrink-0" />
                                                                <span className="text-sm font-medium text-slate-300 truncate">{fileName}</span>
                                                            </div>
                                                            {downloaded && (
                                                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                                    <Check size={12} className="text-emerald-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}

                    {availableCategories.length === 0 && (
                        <div className="p-8 text-center text-slate-500 bg-white/[0.02] rounded-2xl border border-white/5">
                            {t('settings.offline.empty', 'No hi ha materials disponibles per descarregar actualment.')}
                        </div>
                    )}
                </div>

                {/* ADVANCED CACHE EXPLORER */}
                {(detailedCaches.length > 0 || indexedDBs.length > 0) && (
                    <div className="w-full mt-12 border-t border-white/10 pt-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-white">{t('settings.offline.advanced', 'Explorador Avançat')}</h2>
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-6">
                            {t('settings.offline.advancedDesc', 'Gestiona individualment les memòries cau internes i les bases de dades del navegador. Ves amb compte, esborrar arxius de l\'App Shell pot trencar la navegació offline fins que recarreguis la pàgina.')}
                        </p>

                        <div className="mb-6 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs flex items-start gap-3">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                <strong>{t('settings.offline.opaqueNoteTitle', 'Nota tècnica (Opaque Response Padding):')}</strong> {t('settings.offline.opaqueNoteDesc', 'Si el pes total de l\'App Shell és exageradament més alt que el pes sumat dels seus arxius, és perquè el navegador (Chromium/Webkit) infla de forma artificial l\'espai que ocupen les respostes "opaques" (peticions a altres dominis sense configuració estricta CORS, com l\'api-cache) sumant-los fins a ~7MB extra per fitxer per raons de seguretat.')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* CACHES */}
                            {detailedCaches.map((cache, idx) => (
                                <div key={`cache-${idx}`} className="flex flex-col p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div 
                                            className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => setExpandedCache(expandedCache === cache.name ? null : cache.name)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                                <Database size={18} className="text-slate-400" />
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-base font-bold text-slate-200 truncate">{cache.name}</h3>
                                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0 bg-white/10 text-slate-300">
                                                        {formatBytes(cache.size)}
                                                    </span>
                                                    {expandedCache === cache.name ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                                                </div>
                                                <p className="text-slate-500 text-xs truncate">{cache.files.length} {t('settings.offline.filesCount', 'arxius')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 pl-4">
                                            <button type="button" disabled={isProcessing[cache.name]} onClick={() => handleDeleteCache(cache.name)} className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors disabled:opacity-50" title={t('settings.offline.deleteCache', 'Eliminar memòria cau sencera')}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {expandedCache === cache.name && (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="w-full overflow-hidden"
                                            >
                                                <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-1 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                                    {cache.files.map((file, fIdx) => (
                                                        <div key={fIdx} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group/file">
                                                            <div className="flex items-center gap-3 min-w-0 pr-4">
                                                                <span className="text-xs text-slate-400 truncate" title={file.url}>{file.url}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3 shrink-0">
                                                                <span className="text-xs font-medium text-slate-500">
                                                                    {file.isOpaque ? (
                                                                        <span title={t('settings.offline.opaqueTooltip', 'Resposta Opaca (Amagada per CORS). El navegador li suma ~7MB artificialment.')} className="text-amber-500/80 cursor-help border-b border-dashed border-amber-500/30 pb-0.5">Opaque</span>
                                                                    ) : formatBytes(file.size)}
                                                                </span>
                                                                <button type="button" onClick={() => handleDeleteCacheFile(cache.name, file.url)} className="p-1.5 rounded-md hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 opacity-0 group-hover/file:opacity-100 transition-all">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* INDEXEDDBS */}
                            {indexedDBs.map((dbName, idx) => (
                                <div key={`db-${idx}`} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                            <div className="w-4 h-4 rounded-sm bg-slate-500" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <h3 className="text-base font-bold text-slate-200 truncate">{dbName}</h3>
                                            <p className="text-slate-500 text-xs">IndexedDB Database</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleDeleteIndexedDB(dbName)} className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors" title={t('settings.offline.deleteDB', 'Eliminar base de dades')}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
