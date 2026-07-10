import { useEffect, useState } from 'react';
import { Download, Check, Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../contexts/SettingsContext';
import subjectsData from '../../data/subjects.json';
import { useTranslation } from 'react-i18next';
import { tailwindColors } from '../../contexts/SubjectContext';

const CORE_APP_SIZE = 3 * 1024 * 1024; // 3 MB

export const OfflineSection = () => {
    const { t } = useTranslation();
    const { offlineStorage, setOfflineStorage, customSubjectColors } = useSettings();
    const [storageEstimate, setStorageEstimate] = useState<{ quota: number; usage: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
    const [isDownloaded, setIsDownloaded] = useState<Record<string, boolean>>({});
    const [cacheSizes, setCacheSizes] = useState<Record<string, number>>({});
    const [manifest, setManifest] = useState<Record<string, string[]>>({});
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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
            navigator.storage.estimate().then(estimate => {
                setStorageEstimate({
                    quota: estimate.quota || 0,
                    usage: estimate.usage || 0
                });
            });
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
                            const size = Number(response.headers.get('Content-Length')) || 0;
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

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        if (!bytes) return t('settings.offline.unknown', 'Desconegut');
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const knownUsage = CORE_APP_SIZE + Object.values(cacheSizes).reduce((a, b) => a + b, 0);
    const currentUsage = Math.max(knownUsage, storageEstimate ? storageEstimate.usage : knownUsage);
    const otherUsage = currentUsage - knownUsage;

    const corePercentage = (CORE_APP_SIZE / currentUsage) * 100;
    const otherPercentage = (otherUsage / currentUsage) * 100;

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
                                <span className="text-slate-400">{t('settings.offline.appShell', 'App Shell (JS/CSS/HTML)')} <span className="text-slate-500 ml-1">({formatBytes(CORE_APP_SIZE)})</span></span>
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
                                    <span className="text-slate-400">{t('settings.offline.metadata', 'IndexedDB / Metadades')} <span className="text-slate-500 ml-1">({formatBytes(otherUsage)})</span></span>
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
                                                <button
                                                    disabled={processing}
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-sm transition-all disabled:opacity-50"
                                                >
                                                    {processing ? <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                                                    {t('settings.offline.delete', 'Eliminar')}
                                                </button>
                                            ) : (
                                                <button
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
                                            <button
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
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
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

            </div>
        </div>
    );
};
