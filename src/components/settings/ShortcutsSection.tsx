import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Keyboard, RotateCcw } from 'lucide-react';

export const ShortcutsSection = () => {
    const { t } = useTranslation();
    const { shortcuts, setShortcuts } = useSettings();
    const [listeningAction, setListeningAction] = useState<string | null>(null);

    const formatKey = (meta: boolean, key: string) => {
        if (!key) return '';
        const metaStr = meta ? '⌘/Ctrl + ' : '';
        let displayKey = key.toUpperCase();
        if (key === ' ') displayKey = 'SPACE';
        return `${metaStr}${displayKey}`;
    };

    useEffect(() => {
        if (!listeningAction) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Escape') {
                setListeningAction(null);
                return;
            }

            // Ignore just modifier keys pressed alone
            if (['Meta', 'Control', 'Shift', 'Alt'].includes(e.key)) {
                return;
            }

            const meta = e.metaKey || e.ctrlKey;
            const key = e.key.toLowerCase();

            setShortcuts(prev => ({
                ...prev,
                [listeningAction]: { meta, key }
            }));
            setListeningAction(null);
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [listeningAction, setShortcuts]);

    // Available actions
    const actions = [
        { 
            id: 'searchSubjects', 
            label: t('settings.shortcuts.actions.searchSubjects', 'Cercar Assignatures'),
            default: { key: 'k', meta: true }
        }
    ];

    return (
        <div id="shortcuts" className="flex flex-col gap-6 w-full pt-6 pb-12">
            <div className="w-full">
                <h2 className="text-2xl font-bold text-white mb-1">{t('settings.shortcuts.title', 'Dreceres de Teclat')}</h2>
                <p className="text-slate-400 text-sm font-medium">{t('settings.shortcuts.subtitle', 'Personalitza les dreceres per accedir ràpidament a diferents funcions.')}</p>
            </div>

            <div className="w-full mt-2 flex flex-col gap-3">
                {actions.map(action => {
                    const currentShortcut = shortcuts[action.id] || action.default;
                    const isListening = listeningAction === action.id;

                    return (
                        <div key={action.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/[0.02] border border-white/10 p-4 rounded-2xl hover:bg-white/[0.04] transition-colors gap-4 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
                                    <Keyboard size={18} />
                                </div>
                                <span className="text-slate-200 font-medium">{action.label}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <button
                                    onClick={() => setListeningAction(action.id)}
                                    className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all border min-w-[120px] ${
                                        isListening 
                                            ? 'bg-primary/20 border-primary text-primary animate-pulse' 
                                            : 'bg-black/50 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                                    }`}
                                >
                                    {isListening ? t('settings.shortcuts.pressAnyKey', 'Prem qualsevol tecla...') : formatKey(currentShortcut.meta, currentShortcut.key)}
                                </button>

                                <button
                                    title={t('settings.shortcuts.reset', 'Restablir')}
                                    onClick={() => setShortcuts(prev => ({
                                        ...prev,
                                        [action.id]: action.default
                                    }))}
                                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-lg hover:bg-white/10"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
