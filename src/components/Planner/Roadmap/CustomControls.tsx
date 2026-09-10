import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReactFlow, Panel } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import LiquidPanel from '../../ui/glass/LiquidPanel';

export const CustomControls = React.memo(() => {
    const { t } = useTranslation();
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <Panel position="bottom-left" className="m-6 z-40 opacity-30 hover:opacity-100 transition-opacity duration-300 hidden lg:block">
            <LiquidPanel className="flex flex-col gap-2 p-2">
                <button
                    type="button"
                    onClick={() => zoomIn({ duration: 400 })}
                    className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition hover:scale-110 active:scale-95"
                    title={t('roadmapView.zoomIn', 'Zoom In')}
                    aria-label="Acció ZoomIn"
                >
                    <ZoomIn size={18} strokeWidth={2.5} />
                </button>
                <div className="w-full h-px bg-white/5" />
                <button
                    type="button"
                    onClick={() => zoomOut({ duration: 400 })}
                    className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition hover:scale-110 active:scale-95"
                    title={t('roadmapView.zoomOut', 'Zoom Out')}
                    aria-label="Acció ZoomOut"
                >
                    <ZoomOut size={18} strokeWidth={2.5} />
                </button>
                <div className="w-full h-px bg-white/5" />
                <button
                    type="button"
                    onClick={() => fitView({ padding: 0.2, duration: 800 })}
                    className="p-2.5 text-slate-400 hover:text-sky-400 hover:bg-white/5 rounded-xl transition hover:scale-110 active:scale-95"
                    title={t('roadmapView.fitView', 'Fit View')}
                    aria-label="Acció Maximize"
                >
                    <Maximize size={18} strokeWidth={2.5} />
                </button>
            </LiquidPanel>
        </Panel>
    );
});

CustomControls.displayName = 'CustomControls';
export default CustomControls;
